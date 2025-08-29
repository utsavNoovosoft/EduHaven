import jwt from "jsonwebtoken";
import { handleRoomOperations } from "./roomHandlers.js";
import { handleMessageOperations } from "./messageHandlers.js";
import { initializeMediasoup, getRouter } from "../sfu/mediasoupServer.js";
import { roomManager } from "../sfu/RoomManager.js";
// import { handleVoiceOperations } from "./voiceHandlers.js";

const onlineUsers = new Map();
const userSockets = new Map();
let connections = {};
let timeOnline = {};
let router;

const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.name = `${decoded?.FirstName ?? "unknown user"} ${
      decoded?.LastName ?? ""
    }`.trim();

    socket.profileImage = decoded.profileImage || null;

    next();
  } catch (err) {
    console.log("Socket authentication error:", err.message);
    next(new Error("Authentication error"));
  }
};

const initializeSocket = (io) => {
  io.use(authenticateSocket);

  // Initialize mediasoup
  initializeMediasoup().then((mediaRouter) => {
    router = mediaRouter;
    console.log("Mediasoup initialized successfully");
  }).catch((error) => {
    console.error("Failed to initialize mediasoup:", error);
  });

  const broadcastOnlineList = () => {
    const users = Array.from(onlineUsers.entries()).map(
      ([userId, socketId]) => {
        const user = userSockets.get(socketId) || {};
        return {
          id: userId,
          name: user.name || "Unknown",
          profileImage: user.profileImage || null,
        };
      }
    );
    io.emit("online_users_updated", users);
  };

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.name} (${socket.userId})`);

    // Store user connection
    onlineUsers.set(socket.userId, socket.id);
    userSockets.set(socket.id, {
      userId: socket.userId,
      name: socket.name,
      profileImage: socket.profileImage,
    });

    broadcastOnlineList();

    handleRoomOperations(socket, io, onlineUsers);
    handleMessageOperations(socket, io);
    // handleVoiceOperations(socket, io);

    // SFU-specific variables for each connection
    let currentRoom = null;
    let currentPeerId = null;

    // SFU event handlers
    socket.on("join-room", async ({ roomId, userId }) => {
      try {
        if (!router) {
          socket.emit("error", { message: "Server not ready" });
          return;
        }

        currentRoom = roomManager.getOrCreateRoom(roomId, router);
        currentPeerId = userId || socket.userId || socket.id;
        
        socket.join(roomId);
        
        const peer = currentRoom.addPeer(currentPeerId, socket);
        
        // Send router RTP capabilities
        socket.emit("routerRtpCapabilities", router.rtpCapabilities);
        
        // Send existing peers list
        const existingPeers = currentRoom.getPeers().filter(id => id !== currentPeerId);
        socket.emit("existingPeers", { peers: existingPeers });
        
        console.log(`User ${currentPeerId} joined SFU room ${roomId}`);
        
      } catch (error) {
        console.error("Error joining SFU room:", error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("getRouterRtpCapabilities", (callback) => {
      if (router) {
        callback(router.rtpCapabilities);
      } else {
        callback({ error: "Router not initialized" });
      }
    });

    socket.on("createWebRtcTransport", async ({ forceTcp, consuming }, callback) => {
      try {
        if (!currentRoom || !currentPeerId) {
          callback({ error: "Not in a room" });
          return;
        }

        const transportParams = await currentRoom.createWebRtcTransport(currentPeerId);
        
        // Mark transport as consuming if specified
        if (consuming) {
          const peer = currentRoom.getPeer(currentPeerId);
          const transport = peer.transports.get(transportParams.id);
          transport.appData = { consuming: true };
        }
        
        callback(transportParams);
        
      } catch (error) {
        console.error("Error creating transport:", error);
        callback({ error: error.message });
      }
    });

    socket.on("connectTransport", async ({ transportId, dtlsParameters }, callback) => {
      try {
        if (!currentRoom || !currentPeerId) {
          callback({ error: "Not in a room" });
          return;
        }

        await currentRoom.connectTransport(currentPeerId, transportId, dtlsParameters);
        callback({ success: true });
        
      } catch (error) {
        console.error("Error connecting transport:", error);
        callback({ error: error.message });
      }
    });

    socket.on("produce", async ({ transportId, kind, rtpParameters, appData }, callback) => {
      try {
        if (!currentRoom || !currentPeerId) {
          callback({ error: "Not in a room" });
          return;
        }

        const producerId = await currentRoom.produce(
          currentPeerId,
          transportId,
          kind,
          rtpParameters,
          appData
        );
        
        callback({ id: producerId });
        
      } catch (error) {
        console.error("Error producing:", error);
        callback({ error: error.message });
      }
    });

    socket.on("consume", async ({ rtpCapabilities }, callback) => {
      try {
        if (!currentRoom || !currentPeerId) {
          callback({ error: "Not in a room" });
          return;
        }

        // This will be handled automatically when other peers produce
        callback({ success: true });
        
      } catch (error) {
        console.error("Error consuming:", error);
        callback({ error: error.message });
      }
    });

    // Legacy webrtc handlers (keeping for backward compatibility):----------------------------------------------
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }
    });
    
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // Additional SFU-compatible events
    socket.on("user-toggle-audio", (data) => {
      socket.to(data.roomId).emit("user-toggle-audio", data);
    });

    socket.on("user-toggle-video", (data) => {
      socket.to(data.roomId).emit("user-toggle-video", data);
    });

    socket.on("user-leave", (data) => {
      socket.to(data.roomId).emit("user-leave", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.name}`);

      onlineUsers.delete(socket.userId);
      userSockets.delete(socket.id);

      broadcastOnlineList();

      // SFU cleanup
      if (currentRoom && currentPeerId) {
        currentRoom.removePeer(currentPeerId);
        
        // Remove room if empty
        if (currentRoom.peers.size === 0) {
          roomManager.removeRoom(currentRoom.id);
        }
      }

      // Legacy webrtc cleanup:----------------------------------------------
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
      //----------------------------------------------

      // Leave all rooms and notify
      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("user_left_room", {
            userId: socket.userId,
            name: socket.name,
          });
        }
      });
    });

    // Handle manual online status (clients to set their online staus in settings);
    // socket.on("set_online_status", (status) => {
    //   if (status === "offline") {
    //     onlineUsers.delete(socket.userId);
    //   } else {
    //     onlineUsers.set(socket.userId, socket.id);
    //   }
    //   broadcastOnlineList()
    // });

    // // Handle getting online friends
    // socket.on("get_online_friends", () => {
    //   // You can integrate this with your existing friends system
    //   socket.emit("online_friends_list", Array.from(onlineUsers.keys()));
    // });
  });

  console.log("Socket.IO initialized successfully");
};

export default initializeSocket;
export { onlineUsers, userSockets };
