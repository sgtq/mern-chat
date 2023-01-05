import express from "express";
import dotenv from "dotenv";
import { chats } from "./data/data.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
//app.use(cookieParser());

// Routes
app.get("/", (req, res, next) => {
  res.send("Whaaaaa!");
});
app.get("/api/chat", (req, res, next) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res, next) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

// Error Handling
/*
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(500).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
*/

app.listen(PORT, () => {
  console.log("Server started on Port:", PORT);
});
