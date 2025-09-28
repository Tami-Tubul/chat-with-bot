require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { getHistory, addUserMessage, addBotMessageIfNeeded } = require("./services/chatService");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server & attach Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.get("/", (req, res) => res.json({ message: "Chat API Running..." }));

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send chat history to newly connected user
    socket.emit("chatHistory", getHistory());

    // Listen for messages from clients
    socket.on("sendMessage", async (msg) => {
        const userId = msg.userId || socket.id;
        const userName = msg.userName || `User-${socket.id.slice(0, 4)}`;

        // Save user message and broadcast
        const message = addUserMessage(socket.id, userId, userName, msg.text);
        io.emit("newMessage", message);

        // Optionally generate bot response
        await addBotMessageIfNeeded(io, msg.text);
    });

    // Handle disconnection
    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

const fs = require("fs");
const path = require("path");
const clientDistPath = path.join(__dirname, "dist/client/browser");

if (fs.existsSync(clientDistPath)) {
  // Serve Angular static files
  app.use(express.static(clientDistPath));

  // Catch all other routes and return index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  console.log("Warning: Angular dist folder not found. Only API is available.");
}

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

