import React, { useEffect, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ stream, videoRef, participant, isLocal, muted }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setIsLoading(false);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [stream, videoRef]);

  const handleLoadedMetadata = () => {
    setIsLoading(false);
  };

  const getDisplayName = () => {
    if (isLocal) return 'You';
    return participant?.name || `User ${participant?.id?.slice(-6) || 'Unknown'}`;
  };

  return (
    <div className={`video-player ${isLocal ? 'local' : 'remote'}`}>
      {/* Connection Status Indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}></div>
      
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        onLoadedMetadata={handleLoadedMetadata}
        className={`video-element ${!participant?.videoEnabled ? 'video-disabled' : ''}`}
      />
      
      {/* Loading State */}
      {isLoading && stream && (
        <div className="video-loading">
          <div className="spinner"></div>
          <span>Loading video...</span>
        </div>
      )}
      
      {/* Video Placeholder when camera is off */}
      {!participant?.videoEnabled && (
        <div className="video-placeholder">
          <div className="avatar">
            {getDisplayName().charAt(0)?.toUpperCase()}
          </div>
          <span style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '14px', 
            marginTop: '8px',
            textAlign: 'center' 
          }}>
            Camera is off
          </span>
        </div>
      )}
      
      {/* Video Info Bar */}
      <div className="video-info">
        <span className="participant-name">
          {getDisplayName()}
          {isLocal && <span style={{ opacity: 0.8, marginLeft: '4px' }}>(You)</span>}
        </span>
        <div className="audio-indicator">
          {!participant?.audioEnabled && (
            <span className="muted-icon" title="Microphone muted">🔇</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
