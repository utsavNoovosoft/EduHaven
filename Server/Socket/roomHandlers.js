const handleRoomOperations = (socket, io, onlineUsers) => {
  // socket.on("create_room", async (data) => {
  //   try {
  //     const { roomName, description = "" } = data;
  //     const roomId = `room_${Date.now()}_${socket.userId}`;
  //     console.log(`Room created: ${roomName} by ${socket.name}`);
  //     socket.join(roomId);

  //     // TODO: Save room to database
  //     const roomData = {
  //       id: roomId,
  //       name: roomName,
  //       description,
  //       createdBy: socket.userId,
  //       createdByname: socket.name,
  //       participants: [socket.userId],
  //       createdAt: new Date(),
  //       isActive: true,
  //     };

  //     socket.emit("room_created", roomData);

  //     io.emit("new_room_available", {
  //       id: roomId,
  //       name: roomName,
  //       createdBy: socket.name,
  //       participantCount: 1,
  //     });
  //   } catch (error) {
  //     console.error("Error creating room:", error);
  //     socket.emit("error", { message: "Failed to create room" });
  //   }
  // });

  // Join an existing room

  socket.on("join_room", async (data) => {
    try {
      const { roomId } = data;

      // TODO: Validate room exists in database

      socket.join(roomId);
      const socketsInRoom = await io.in(roomId).fetchSockets();
      const existingParticipants = socketsInRoom.map((s) => ({
        userId: s.userId,
        name: s.name,
        profileImage: s.profileImage,
      }));

      // Notify others in room
      socket.to(roomId).emit("user_joined_room", {
        userId: socket.userId,
        name: socket.name,
        profileImage: socket.profileImage,
        joinedAt: new Date(),
      });

      // TODO: Fetch from database

      // Get room info and send to user
      const roomInfo = {
        roomId,
        joinedAt: new Date(),
        participants: existingParticipants,
      };

      socket.emit("room_joined", roomInfo);

      // Update participant count for all users
      io.emit("room_participant_update", {
        roomId,
        participantCount: socketsInRoom.length,
      });

      console.log(`${socket.name} joined room: ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Leave room
  socket.on("leave_room", async (data) => {
    try {
      const { roomId } = data;

      socket.leave(roomId);

      // Notify others in room
      socket.to(roomId).emit("user_left_room", {
        userId: socket.userId,
        name: socket.name,
        leftAt: new Date(),
      });

      socket.emit("room_left", { roomId });

      // Update participant count
      const socketsInRoom = await io.in(roomId).fetchSockets();
      io.emit("room_participant_update", {
        roomId,
        participantCount: socketsInRoom.length,
      });

      console.log(`${socket.name} left room: ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", { message: "Failed to leave room" });
    }
  });

  // Delete room (creator only)
  // socket.on("delete_room", async (data) => {
  //   try {
  //     const { roomId } = data;

  //     // TODO: Verify user is room creator from database
  //     console.log(`Room deletion requested: ${roomId} by ${socket.name}`);

  //     // Notify all users in room
  //     io.to(roomId).emit("room_deleted", {
  //       roomId,
  //       deletedBy: socket.name,
  //       deletedAt: new Date(),
  //     });

  //     // Remove all users from room
  //     const socketsInRoom = await io.in(roomId).fetchSockets();
  //     socketsInRoom.forEach((s) => s.leave(roomId));

  //     // Notify all users that room is no longer available
  //     io.emit("room_removed", { roomId });

  //     console.log(`Room deleted: ${roomId} by ${socket.name}`);
  //   } catch (error) {
  //     console.error("Error deleting room:", error);
  //     socket.emit("error", { message: "Failed to delete room" });
  //   }
  // });

  // Get available rooms
  // socket.on("get_rooms", async () => {
  //   try {
  //     // TODO: Fetch rooms from database
  //     const rooms = []; // Placeholder - you'll replace this with actual database query

  //     socket.emit("rooms_list", rooms);
  //   } catch (error) {
  //     console.error("Error fetching rooms:", error);
  //     socket.emit("error", { message: "Failed to fetch rooms" });
  //   }
  // });

  // Get room participants
  socket.on("get_room_participants", async (data) => {
    try {
      const { roomId } = data;
      const socketsInRoom = await io.in(roomId).fetchSockets();

      const participants = socketsInRoom.map((s) => ({
        userId: s.userId,
        name: s.name,
      }));

      socket.emit("room_participants", { roomId, participants });
    } catch (error) {
      console.error("Error getting room participants:", error);
      socket.emit("error", { message: "Failed to get room participants" });
    }
  });
};

export { handleRoomOperations };
