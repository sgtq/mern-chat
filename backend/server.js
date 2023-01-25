import express from "express";
import dotenv from "dotenv";
import connect from "./configs/db.js";
import { chats } from "./data/data.js";
import colors from "colors";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
//app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
    connect();
    console.log("Server started on Port:", PORT.yellow.bold);
});

// Sockets
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: `http://localhost:3000`, //SET FROM FRONT END PORT
    },
});

io.on("connection", (socket) => {
    console.log("connected".green, "to socket.io");
    // user should be connected to his own socket
    socket.on("setup", (userData) => {
        socket.join(userData._id); // create room for specific user
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room); // create new room chat
        console.log("User joined room:", room.green);
    });

    socket.on("new msg", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) {
                return;
            }

            socket.in(user._id).emit("msg received", newMessageReceived);
        });
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("USER DISCONNECTED".yellow);
        socket.leave(userData._id);
    });
});
