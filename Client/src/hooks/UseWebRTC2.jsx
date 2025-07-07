// Client/src/hooks/useWebRTC.js
import { useState, useEffect, useRef, useCallback } from "react";

const useWebRTC = (socket, roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState(new Map()); // userId -> MediaStream

  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map()); // userId -> RTCPeerConnection

  // 1) STUN-only config
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // 2) Get camera+mic once
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
  }, []);

  // 3) Helper: create and configure a new RTCPeerConnection
  const makePC = useCallback(
    (peerId) => {
      const pc = new RTCPeerConnection(rtcConfig);

      // a) send our tracks
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // b) ICE → socket
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("ice-candidate", { to: peerId, candidate });
        }
      };

      // c) remote tracks → add to state
      pc.ontrack = ({ streams: [stream] }) => {
        setPeers((prev) => {
          const updated = new Map(prev);
          updated.set(peerId, stream);
          return updated;
        });
      };

      // d) debug logging
      pc.oniceconnectionstatechange = () => {
        console.log(`PC[${peerId}] ICE state:`, pc.iceConnectionState);
      };

      peerConnections.current.set(peerId, pc);
      return pc;
    },
    [localStream, socket]
  );

  // 4) Socket signaling
  useEffect(() => {
    if (!socket || !roomId || !localStream) return;

    // Join the room (server should broadcast back a list of other users)
    socket.emit("join-room", { roomId });

    // When server tells us who’s already here
    socket.on("room-users", ({ users }) => {
      users.forEach((peerId) => {
        // create PC + offer
        const pc = makePC(peerId);
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit("offer", {
              to: peerId,
              sdp: pc.localDescription,
            });
          });
      });
    });

    // Incoming offer → answer
    socket.on("offer", async ({ from, sdp }) => {
      const pc = makePC(from);
      await pc.setRemoteDescription(sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, sdp: pc.localDescription });
    });

    // Incoming answer → finish
    socket.on("answer", async ({ from, sdp }) => {
      const pc = peerConnections.current.get(from);
      if (pc) await pc.setRemoteDescription(sdp);
    });

    // Incoming ICE → add
    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = peerConnections.current.get(from);
      if (pc) await pc.addIceCandidate(candidate);
    });

    // Clean up on unmount
    return () => {
      socket.off("room-users");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      localStream.getTracks().forEach((t) => t.stop());
    };
  }, [socket, roomId, localStream, makePC]);

  return {
    localVideoRef,
    peers, // Map of userId → MediaStream
  };
};

export default useWebRTC;
