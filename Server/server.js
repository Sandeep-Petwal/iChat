const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: "*" });
const { socketConnection } = require("./socket/socket");

const userRouter = require("./routes/userRouter");
const messageRoutes = require("./routes/messageRoutes");

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoutes);

// socket connection in different file
socketConnection(io);

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
