// Client/src/hooks/useWebRTC.js
import { useState, useEffect, useRef, useCallback } from "react";

const useWebRTC = (socket, roomId) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peers, setPeers] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);

  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const localStreamRef = useRef(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Get user media
  const getUserMedia = useCallback(async (video = false, audio = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: audio,
      });

      setLocalStream(stream);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }, []);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      localStreamRef.current = stream;
      setIsScreenSharing(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Replace video track for all peer connections
      peerConnections.current.forEach(async (pc) => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      // Handle screen share end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      return stream;
    } catch (error) {
      console.error("Error starting screen share:", error);
      throw error;
    }
  }, []);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsScreenSharing(false);
    setLocalStream(null);
    localStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    try {
      if (!isAudioEnabled) {
        const stream = await getUserMedia(isVideoEnabled, true);
        setIsAudioEnabled(true);

        // Notify other users
        if (socket && roomId) {
          socket.emit("voice_status_change", {
            roomId,
            status: "joined",
            muted: false,
          });
        }
      } else {
        if (localStreamRef.current) {
          const audioTracks = localStreamRef.current.getAudioTracks();
          audioTracks.forEach((track) => track.stop());
        }
        setIsAudioEnabled(false);

        // Notify other users
        if (socket && roomId) {
          socket.emit("voice_status_change", {
            roomId,
            status: "left",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  }, [isAudioEnabled, isVideoEnabled, getUserMedia, socket, roomId]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    try {
      if (!isVideoEnabled) {
        const stream = await getUserMedia(true, isAudioEnabled);
        setIsVideoEnabled(true);
      } else {
        if (localStreamRef.current) {
          const videoTracks = localStreamRef.current.getVideoTracks();
          videoTracks.forEach((track) => track.stop());
        }
        setIsVideoEnabled(false);
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  }, [isVideoEnabled, isAudioEnabled, getUserMedia]);

  // Create peer connection
  const createPeerConnection = useCallback(
    (userId) => {
      const pc = new RTCPeerConnection(rtcConfig);

      // Add local stream to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      // Handle remote stream
      pc.ontrack = (event) => {
        setPeers(
          (prev) =>
            new Map(
              prev.set(userId, {
                userId,
                stream: event.streams[0],
              })
            )
        );
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice_candidate", {
            roomId,
            candidate: event.candidate,
            targetUserId: userId,
          });
        }
      };

      peerConnections.current.set(userId, pc);
      console.log("garma garam peer connection returning...")
      return pc;
    },
    [socket, roomId]
  );

  // WebRTC signaling through socket
  useEffect(() => {
    if (!socket) return;

    socket.on("voice_offer", async (data) => {
      const { offer, fromUserId } = data;

      const pc = createPeerConnection(fromUserId);
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log("the voice is comming");
      socket.emit("voice_answer", {
        roomId,
        answer,
        targetUserId: fromUserId,
      });
    });

    socket.on("voice_answer", async (data) => {
      const { answer, fromUserId } = data;
      const pc = peerConnections.current.get(fromUserId);

      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    });

    socket.on("ice_candidate", async (data) => {
      const { candidate, fromUserId } = data;
      const pc = peerConnections.current.get(fromUserId);

      if (pc) {
        await pc.addIceCandidate(candidate);
      }
    });

    socket.on("user_joined_voice", (data) => {
      // Initiate call to new user
      const pc = createPeerConnection(data.userId);

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.emit("voice_offer", {
          roomId,
          offer,
          targetUserId: data.userId,
        });
      });
    });

    socket.on("user_left_voice", (data) => {
      const pc = peerConnections.current.get(data.userId);
      if (pc) {
        pc.close();
        peerConnections.current.delete(data.userId);
      }
      setPeers((prev) => {
        const newPeers = new Map(prev);
        newPeers.delete(data.userId);
        return newPeers;
      });
    });

    return () => {
      socket.off("voice_offer");
      socket.off("voice_answer");
      socket.off("ice_candidate");
      socket.off("user_joined_voice");
      socket.off("user_left_voice");
    };
  }, [socket, roomId, createPeerConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
    };
  }, []);

  return {
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    localStream,
    peers,
    localVideoRef,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  };
};

export default useWebRTC;
