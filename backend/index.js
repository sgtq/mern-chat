import express from "express";
import dotenv from "dotenv";
import connect from "./configs/db.js";
import { chats } from "./data/data.js";
import colors from "colors";

import userRoutes from "./routes/userRoutes.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
//app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);

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
  connect();
  console.log("Server started on Port:", PORT.yellow.bold);
});
