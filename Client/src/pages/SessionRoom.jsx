import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useWebRTCConnection from '../hooks/WebRTC/WebRTCConnection';
import Controls from '../components/sessionRooms/Controls';
import VideoGrid from '../components/sessionRooms/VideoGrid';
import ChatPannel from '@/components/sessionRooms/ChatPannel';
import ShowInfo from '@/components/sessionRooms/InfoPannel';
import useSessionChat from '../hooks/useSessionChat';
import './SessionRoom.css';

function SessionRoom() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [userId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [showChat, setShowChat] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [participants, setParticipants] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token') // Use existing auth token if available
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      // Handle authentication errors gracefully
      if (error.message === 'Authentication error') {
        console.log('Authentication failed, but continuing for demo purposes');
        setSocket(newSocket);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // WebRTC connection hook
  const {
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
    remoteVideoRefs,
  } = useWebRTCConnection(socket, roomId, userId);

  // Chat functionality
  const { messages, typingUsers, sendMessage, startTyping, stopTyping } =
    useSessionChat(socket, roomId);

  // Update participants list
  useEffect(() => {
    const participantsList = [
      {
        id: userId,
        name: `You (${userId.slice(-6)})`,
        isLocal: true,
        audioEnabled: isAudioEnabled,
        videoEnabled: isVideoEnabled,
      },
      ...peers.map(peerId => ({
        id: peerId,
        name: `User ${peerId.slice(-6)}`,
        isLocal: false,
        audioEnabled: true, // This should come from peer state in production
        videoEnabled: true, // This should come from peer state in production
      }))
    ];
    setParticipants(participantsList);
  }, [userId, peers, isAudioEnabled, isVideoEnabled]);

  const leaveRoom = () => {
    if (socket) {
      socket.emit('user-leave', { roomId, userId });
    }
    navigate('/');
  };

  if (!socket || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">
            {isConnecting ? 'Connecting to room...' : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-white font-semibold">Room: {roomId}</h2>
          <div className="text-gray-400 text-sm">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
        </div>
        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
        >
          Leave Room
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 bg-black relative">
          <VideoGrid
            localStream={localStream}
            remoteStreams={remoteStreams}
            localVideoRef={localVideoRef}
            remoteVideoRefs={remoteVideoRefs}
            participants={participants}
            userId={userId}
          />
        </div>

        {showChat && (
          <ChatPannel
            messages={messages}
            typingUsers={typingUsers}
            sendMessage={sendMessage}
            startTyping={startTyping}
            stopTyping={stopTyping}
            setShowChat={setShowChat}
          />
        )}

        {showInfo && <ShowInfo setShowInfo={setShowInfo} />}
      </div>

      <Controls
        roomId={roomId}
        showChat={showChat}
        showInfo={showInfo}
        setShowChat={setShowChat}
        setShowInfo={setShowInfo}
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        onLeaveRoom={leaveRoom}
      />
    </div>
  );
}

export default SessionRoom;
