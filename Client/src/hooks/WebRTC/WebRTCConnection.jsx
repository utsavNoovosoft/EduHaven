/**
 * WebRTCConnection.jsx
 *
 * SFU-based WebRTC connection hook for video calling functionality.
 * Manages mediasoup-client connections for scalable video conferences.
 * Replaces the previous P2P mesh architecture with a centralized SFU approach.
 *
 * - Manages SFU connections using mediasoup-client
 * - Handles media producers and consumers
 * - Coordinates media stream sharing through SFU server
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import SFUService from '../../services/SFUService';

const useWebRTCConnection = (socket, roomId, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peers, setPeers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const sfuService = useRef(new SFUService());
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());

  // Initialize SFU connection
  const initializeSFU = useCallback(async () => {
    try {
      if (!socket || isConnecting) return;
      
      setIsConnecting(true);
      await sfuService.current.initialize(socket);
      console.log('SFU initialized successfully');
      
      // Join room
      socket.emit('join-room', { roomId, userId });
      
    } catch (error) {
      console.error('Failed to initialize SFU:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [socket, roomId, userId, isConnecting]);

  // Get user media
  const getUserMedia = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      throw error;
    }
  }, []);

  // Start producing media
  const startProducing = useCallback(async (stream) => {
    if (!stream || !sfuService.current.isDeviceLoaded) return;

    try {
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) {
        await sfuService.current.produce(videoTrack, 'video');
        console.log('Video producer created');
      }

      if (audioTrack) {
        await sfuService.current.produce(audioTrack, 'audio');
        console.log('Audio producer created');
      }
    } catch (error) {
      console.error('Failed to start producing:', error);
    }
  }, []);

  // Handle new consumer
  const handleNewConsumer = useCallback(async (consumerInfo) => {
    try {
      const consumer = await sfuService.current.consume(consumerInfo);
      const { track } = consumer;
      
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        const peerId = consumerInfo.peerId;
        
        if (!newStreams.has(peerId)) {
          newStreams.set(peerId, new MediaStream());
        }
        
        const stream = newStreams.get(peerId);
        stream.addTrack(track);
        
        return newStreams;
      });

      console.log(`New consumer created for peer ${consumerInfo.peerId}`);
    } catch (error) {
      console.error('Failed to handle new consumer:', error);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Notify other peers
        socket?.emit('user-toggle-audio', {
          roomId,
          userId,
          audioEnabled: audioTrack.enabled
        });
      }
    }
  }, [localStream, socket, roomId, userId]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Notify other peers
        socket?.emit('user-toggle-video', {
          roomId,
          userId,
          videoEnabled: videoTrack.enabled
        });
      }
    }
  }, [localStream, socket, roomId, userId]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      
      if (localStream) {
        const oldVideoTrack = localStream.getVideoTracks()[0];
        if (oldVideoTrack) {
          localStream.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        }
        localStream.addTrack(screenVideoTrack);
      }

      // Produce new screen track
      await sfuService.current.produce(screenVideoTrack, 'video');
      
      setIsScreenSharing(true);

      // Handle screen share end
      screenVideoTrack.onended = async () => {
        await stopScreenShare();
      };

    } catch (error) {
      console.error('Failed to start screen sharing:', error);
    }
  }, [localStream]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      const cameraVideoTrack = cameraStream.getVideoTracks()[0];
      
      if (localStream) {
        const screenTrack = localStream.getVideoTracks()[0];
        if (screenTrack) {
          localStream.removeTrack(screenTrack);
          screenTrack.stop();
        }
        localStream.addTrack(cameraVideoTrack);
      }

      // Produce new camera track
      await sfuService.current.produce(cameraVideoTrack, 'video');
      
      setIsScreenSharing(false);
    } catch (error) {
      console.error('Failed to stop screen sharing:', error);
    }
  }, [localStream]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleRouterRtpCapabilities = async (rtpCapabilities) => {
      console.log('Received router RTP capabilities');
    };

    const handleExistingPeers = (data) => {
      setPeers(data.peers);
      console.log('Existing peers:', data.peers);
    };

    const handleNewPeer = (data) => {
      setPeers(prev => [...prev, data.peerId]);
      console.log('New peer joined:', data.peerId);
    };

    const handlePeerLeft = (data) => {
      setPeers(prev => prev.filter(id => id !== data.peerId));
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.delete(data.peerId);
        return newStreams;
      });
      console.log('Peer left:', data.peerId);
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
    };

    socket.on('routerRtpCapabilities', handleRouterRtpCapabilities);
    socket.on('existingPeers', handleExistingPeers);
    socket.on('newPeer', handleNewPeer);
    socket.on('peerLeft', handlePeerLeft);
    socket.on('newConsumer', handleNewConsumer);
    socket.on('error', handleError);

    return () => {
      socket.off('routerRtpCapabilities', handleRouterRtpCapabilities);
      socket.off('existingPeers', handleExistingPeers);
      socket.off('newPeer', handleNewPeer);
      socket.off('peerLeft', handlePeerLeft);
      socket.off('newConsumer', handleNewConsumer);
      socket.off('error', handleError);
    };
  }, [socket, handleNewConsumer]);

  // Initialize everything
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeSFU();
        const stream = await getUserMedia();
        
        // Small delay to ensure SFU is ready
        setTimeout(async () => {
          await startProducing(stream);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to initialize WebRTC:', error);
      }
    };

    if (socket && roomId && userId && !isConnecting) {
      initialize();
    }

    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      sfuService.current.close();
    };
  }, [socket, roomId, userId, initializeSFU, getUserMedia, startProducing, isConnecting]);

  return {
    localStream,
    remoteStreams,
    peers,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    isConnecting,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    localVideoRef,
    remoteVideoRefs: remoteVideoRefs.current,
  };
};

export default useWebRTCConnection;
