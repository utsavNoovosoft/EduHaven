import React, { useEffect } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ stream, videoRef, participant, isLocal, muted }) => {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className={`video-player ${isLocal ? 'local' : 'remote'}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`video-element ${!participant?.videoEnabled ? 'video-disabled' : ''}`}
      />
      
      {!participant?.videoEnabled && (
        <div className="video-placeholder">
          <div className="avatar">
            {participant?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
      )}
      
      <div className="video-info">
        <span className="participant-name">{participant?.name || 'Unknown'}</span>
        <div className="audio-indicator">
          {!participant?.audioEnabled && (
            <span className="muted-icon">🔇</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
