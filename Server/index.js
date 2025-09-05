import express from "express";
import { ConnectDB } from "./Database/Db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch, { Headers, Request, Response } from "node-fetch";

import authRoutes from "./Routes/AuthRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import StudySessionRoutes from "./Routes/StudySessionRoutes.js";
import SessionRoomRoutes from "./Routes/SessionRoomRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";

// Security Middleware
import { applySecurity } from "./security/securityMiddleware.js";

import { initializeSocket } from "./Socket/socket.js";
import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";

dotenv.config();

// Polyfill fetch for Node
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Apply security middleware (helmet, hpp, etc.)
applySecurity(app);

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (Uptime Monitoring)
app.get("/uptime", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date(),
  });
});

// Basic route
app.get("/", (req, res) => res.send("Hello, World!"));

// API Routes
app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/study-sessions", StudySessionRoutes);
app.use("/session-room", SessionRoomRoutes);
app.use("/friends", FriendsRoutes);
app.use("/user", UserRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize Socket
initializeSocket(io);

// Start server & connect DB
server.listen(port, () => {
  ConnectDB();
  console.log(`🚀 Server running at http://localhost:${port}`);
});
