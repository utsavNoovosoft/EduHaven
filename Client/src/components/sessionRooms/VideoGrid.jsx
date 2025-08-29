import React from 'react';
import VideoPlayer from './VideoPlayer';
import './VideoGrid.css';

const VideoGrid = ({ 
  localStream, 
  remoteStreams, 
  localVideoRef, 
  remoteVideoRefs, 
  participants, 
  userId 
}) => {
  const totalParticipants = participants.length;
  
  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-1';
    if (totalParticipants === 2) return 'grid-2';
    if (totalParticipants <= 4) return 'grid-4';
    if (totalParticipants <= 6) return 'grid-6';
    return 'grid-many';
  };

  return (
    <div className={`video-grid ${getGridClass()}`}>
      {/* Local video */}
      <VideoPlayer
        stream={localStream}
        videoRef={localVideoRef}
        participant={participants.find(p => p.id === userId)}
        isLocal={true}
        muted={true}
      />

      {/* Remote videos */}
      {Array.from(remoteStreams.entries()).map(([peerId, stream]) => {
        const participant = participants.find(p => p.id === peerId);
        
        if (!remoteVideoRefs.has(peerId)) {
          remoteVideoRefs.set(peerId, React.createRef());
        }
        
        return (
          <VideoPlayer
            key={peerId}
            stream={stream}
            videoRef={remoteVideoRefs.get(peerId)}
            participant={participant}
            isLocal={false}
            muted={false}
          />
        );
      })}
    </div>
  );
};

export default VideoGrid;
