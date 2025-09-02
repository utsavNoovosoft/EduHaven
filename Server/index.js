import express from "express";
import { ConnectDB } from "./Database/Db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import UserRoutes from "./Routes/UserRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import authRoutes from "./Routes/AuthRoutes.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import StudySessionRoutes from "./Routes/StudySessionRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import SessionRoomRoutes from "./Routes/SessionRoomRoutes.js";

import { applySecurity } from "./security/securityMiddleware.js";
import { initializeSocket } from "./Socket/socket.js";

import fetch, { Headers, Request, Response } from "node-fetch";

dotenv.config();

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
    globalThis.Headers = Headers;
    globalThis.Request = Request;
    globalThis.Response = Response;
}

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

applySecurity(app);

// Health check endpoint
app.get("/uptime", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is healthy",
        timestamp: new Date(),
    });
});

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/study-sessions", StudySessionRoutes);
app.use("/session-room", SessionRoomRoutes);
app.use("/friends", FriendsRoutes);
app.use("/user", UserRoutes);

initializeSocket(io);

server.listen(port, () => {
    ConnectDB();
    console.log(`Server running at http://localhost:${port}`);
});