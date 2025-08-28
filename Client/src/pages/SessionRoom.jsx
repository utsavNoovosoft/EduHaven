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
    if (socket) return; // Prevent multiple socket connections
    
    console.log('Initializing new socket connection...');
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token') // Use existing auth token if available
      },
      timeout: 20000,
      forceNew: false // Don't force new connection if one exists
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      // Don't automatically reconnect to prevent loops
      if (reason === 'io client disconnect') {
        // This was a manual disconnect, don't reconnect
        return;
      }
      // For other reasons, let socket.io handle reconnection
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
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []); // Empty dependency array to run only once

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

  // Update participants list (with debounce to prevent rapid updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
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
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [userId, peers, isAudioEnabled, isVideoEnabled]);

  const leaveRoom = () => {
    if (socket) {
      socket.emit('user-leave', { roomId, userId });
    }
    navigate('/');
  };

  if (!socket || isConnecting || !roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-20 animate-ping"></div>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {isConnecting ? 'Joining Study Session...' : 'Initializing...'}
          </h3>
          <p className="text-gray-400 text-sm">
            {isConnecting ? 'Setting up your video connection' : 'Please wait while we prepare your session'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-700 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-white font-semibold text-lg">
              Study Session
            </h2>
          </div>
          <div className="text-gray-300 text-sm bg-gray-700 px-3 py-1 rounded-full">
            Room: {roomId?.slice(-8)}...
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            <span>
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <button
          onClick={leaveRoom}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Leave Session
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Enhanced Video Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative p-4">
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
