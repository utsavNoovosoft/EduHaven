// Server/Socket/voiceHandlers.js
const handleVoiceOperations = (socket, io) => {
  // WebRTC signaling for voice chat
  socket.on("voice_offer", (data) => {
    const { roomId, offer, targetUserId } = data;

    console.log(`Voice offer from ${socket.name} in room ${roomId}`);

    // Forward offer to specific user or broadcast to room
    if (targetUserId) {
      socket.to(roomId).emit("voice_offer", {
        offer,
        fromUserId: socket.userId,
        fromUsername: socket.name,
        targetUserId,
      });
    } else {
      socket.to(roomId).emit("voice_offer", {
        offer,
        fromUserId: socket.userId,
        fromUsername: socket.name,
      });
    }
  });

  socket.on("voice_answer", (data) => {
    const { roomId, answer, targetUserId } = data;

    console.log(`Voice answer from ${socket.name} in room ${roomId}`);

    socket.to(roomId).emit("voice_answer", {
      answer,
      fromUserId: socket.userId,
      fromUsername: socket.name,
      targetUserId,
    });
  });

  socket.on("ice_candidate", (data) => {
    const { roomId, candidate, targetUserId } = data;

    // Forward ICE candidate
    socket.to(roomId).emit("ice_candidate", {
      candidate,
      fromUserId: socket.userId,
      targetUserId,
    });
  });

  // Voice chat status updates
  socket.on("voice_status_change", (data) => {
    const { roomId, status, muted = false } = data;
    // status: 'joined', 'left', 'speaking', 'idle'

    console.log(`Voice status change: ${socket.name} - ${status}`);

    socket.to(roomId).emit("user_voice_status", {
      userId: socket.userId,
      name: socket.name,
      status,
      muted,
      timestamp: new Date(),
    });
  });

  // Handle voice chat join/leave
  socket.on("join_voice_chat", (data) => {
    const { roomId } = data;

    socket.to(roomId).emit("user_joined_voice", {
      userId: socket.userId,
      name: socket.name,
      joinedAt: new Date(),
    });
  });

  socket.on("leave_voice_chat", (data) => {
    const { roomId } = data;

    socket.to(roomId).emit("user_left_voice", {
      userId: socket.userId,
      name: socket.name,
      leftAt: new Date(),
    });
  });
};

export { handleVoiceOperations };
