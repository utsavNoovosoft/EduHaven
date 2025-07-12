// Server/Socket/voiceHandlers.js
const handleVoiceOperations = (socket, io) => {
  const connections = {}; // <— holds arrays of socket IDs per room path
  const timeOnline = {}; // <— optional tracking of join times
  // const messages = {};

  // WebRTC signaling for voice chat
  // socket.on("voice_offer", (data) => {
  //   const { roomId, offer, targetUserId } = data;

  //   console.log(`Voice offer from ${socket.name} in room ${roomId}`);

  //   // Forward offer to specific user or broadcast to room
  //   if (targetUserId) {
  //     socket.to(roomId).emit("voice_offer", {
  //       offer,
  //       fromUserId: socket.userId,
  //       fromUsername: socket.name,
  //       targetUserId,
  //     });
  //   } else {
  //     socket.to(roomId).emit("voice_offer", {
  //       offer,
  //       fromUserId: socket.userId,
  //       fromUsername: socket.name,
  //     });
  //   }
  // });

  // socket.on("voice_answer", (data) => {
  //   const { roomId, answer, targetUserId } = data;

  //   console.log(`Voice answer from ${socket.name} in room ${roomId}`);

  //   socket.to(roomId).emit("voice_answer", {
  //     answer,
  //     fromUserId: socket.userId,
  //     fromUsername: socket.name,
  //     targetUserId,
  //   });
  // });

  // socket.on("ice_candidate", (data) => {
  //   const { roomId, candidate, targetUserId } = data;

  //   // Forward ICE candidate
  //   socket.to(roomId).emit("ice_candidate", {
  //     candidate,
  //     fromUserId: socket.userId,
  //     targetUserId,
  //   });
  // });

  // // Voice chat status updates
  // socket.on("voice_status_change", (data) => {
  //   const { roomId, status, muted = false } = data;
  //   // status: 'joined', 'left', 'speaking', 'idle'

  //   console.log(`Voice status change: ${socket.name} - ${status}`);

  //   socket.to(roomId).emit("user_voice_status", {
  //     userId: socket.userId,
  //     name: socket.name,
  //     status,
  //     muted,
  //     timestamp: new Date(),
  //   });
  // });

  // // Handle voice chat join/leave
  // socket.on("join_voice_chat", (data) => {
  //   const { roomId } = data;

  //   socket.to(roomId).emit("user_joined_voice", {
  //     userId: socket.userId,
  //     name: socket.name,
  //     joinedAt: new Date(),
  //   });
  // });

  // socket.on("leave_voice_chat", (data) => {
  //   const { roomId } = data;

  //   socket.to(roomId).emit("user_left_voice", {
  //     userId: socket.userId,
  //     name: socket.name,
  //     leftAt: new Date(),
  //   });
  // });

  socket.on("join-call", (path) => {
    console.log("trying to join the call");
    if (connections[path] === undefined) {
      connections[path] = [];
    }
    connections[path].push(socket.id);

    timeOnline[socket.id] = new Date();

    // connections[path].forEach(elem => {
    //     io.to(elem)
    // })

    for (let a = 0; a < connections[path].length; a++) {
      console.log("someone joined the call");
      io.to(connections[path][a]).emit(
        "user-joined",
        socket.id,
        connections[path]
      );
    }

    // if (messages[path] !== undefined) {
    //   for (let a = 0; a < messages[path].length; ++a) {
    //     io.to(socket.id).emit(
    //       "chat-message",
    //       messages[path][a]["data"],
    //       messages[path][a]["sender"],
    //       messages[path][a]["socket-id-sender"]
    //     );
    //   }
    // }
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });
};

export { handleVoiceOperations };
