import express from "express";
import { createServer } from "http";
import fetch, { Headers, Request, Response } from "node-fetch";
import { PORT } from "./Config/envConfig.js";
import { applyCommonMiddleware } from "./Config/commonMiddlewares.js";
import { ConnectDB } from "./Database/Db.js";
import { mountRoutes } from "./Routes/routes.js";
import { mountHealthRoutes } from "./Routes/HealthRoutes.js";
import { applySecurity } from "./security/securityMiddleware.js";
import { createSocket, initSocketHandlers } from "./config/socketConfig.js";
import notFound from "./Middlewares/notFound.js";
import errorHandler from "./Middlewares/errorHandler.js";


// Polyfill fetch for Node (if needed)
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const app = express();


// Apply project-specific security middleware (keep this)
applySecurity(app);

applyCommonMiddleware(app);

mountHealthRoutes(app);

mountRoutes(app)

// 404 + error middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server (but do not listen yet)
const server = createServer(app);

// Create socket.io instance; we will initialize handlers after DB connect
const io = createSocket(server);

// -------------------- Interactive graceful shutdown --------------------
import readline from "readline";

let shuttingDown = false;

// helper to read a single key from stdin (works cross-platform)
function waitForKeypress(promptText = "Press Y to confirm, N to cancel: ") {
  return new Promise((resolve) => {
    // ensure stdin is flowing
    if (!process.stdin.isTTY) {
      // non-interactive shell - resolve as yes to not hang
      return resolve("y");
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer ? answer.trim().toLowerCase() : "");
    });
  });
}

async function shutdownDB() {
  try {
    if (typeof globalThis.dbClose === "function") {
      await globalThis.dbClose();
    }
  } catch (err) {
    console.warn("⚠️ Error while closing DB:", err);
  }
}

const doGracefulShutdown = async (signal) => {
  // prevent re-entry
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  // If server is listening, close it first then clean up DB
  if (server && server.listening) {
    server.close(async (err) => {
      if (err) {
        console.error("❌ Error while closing server:", err);
        await shutdownDB(); // attempt DB cleanup even on error
        process.exit(1);
      }
      // server closed successfully -> cleanup DB then exit
      await shutdownDB();
      console.log("✅ Graceful shutdown complete.");
      process.exit(0);
    });
  } else {
    // server not listening (never started) -> just cleanup DB and exit
    await shutdownDB();
    console.log("✅ Graceful shutdown complete.");
    process.exit(0);
  }

  // Force exit after 10s if something hangs
  setTimeout(() => {
    console.error("⚠️ Forcing shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
};

// interactive SIGINT handler: ask for confirmation before shutdown
let sigintPromptActive = false;
process.on("SIGINT", async () => {
  // If shutdown is already in progress, ignore additional SIGINTs
  if (shuttingDown) return;

  // If a prompt is already active, ignore duplicate SIGINTs
  if (sigintPromptActive) return;
  sigintPromptActive = true;

  try {
    // Ask user to confirm exit. Customize the message if you want.
    const answer = await waitForKeypress("\nAre you sure you want to exit? (Y/N): ");

    sigintPromptActive = false;

    if (answer === "y" || answer === "yes") {
      // proceed with graceful shutdown (logs and exit will follow)
      await doGracefulShutdown("SIGINT");
    } else {
      console.log("Shutdown cancelled. Continuing to run.");
      // allow further SIGINTs to prompt again
      sigintPromptActive = false;
    }
  } catch (err) {
    sigintPromptActive = false;
    console.error("Error reading confirmation input:", err);
    // fallback: do immediate graceful shutdown to avoid hanging
    await doGracefulShutdown("SIGINT");
  }
});

// immediate shutdown for SIGTERM and fatal errors (no confirmation)
process.on("SIGTERM", () => {
  if (!shuttingDown) doGracefulShutdown("SIGTERM");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  if (!shuttingDown) doGracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  if (!shuttingDown) doGracefulShutdown("unhandledRejection");
});
// ---------------------------------------------------------------------


// Start: ensure DB connected first, then start server and initialize sockets
async function start() {
  try {
    console.log("🚀 Starting server...");
    await ConnectDB(); // ensure ConnectDB throws on failure

    // Initialize your socket handlers after DB ready
    initSocketHandlers(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    // Run defensive graceful shutdown so the same cleanup path runs
    // This will attempt DB cleanup (noop if not connected) then exit.
    gracefulExit("startupFailure");
  }
}

start();

// export for tests / external tooling
export { app, server, io };
