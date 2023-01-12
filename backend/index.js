import express from "express";
import dotenv from "dotenv";
import connect from "./configs/db.js";
import { chats } from "./data/data.js";
import colors from "colors";

import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
//app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connect();
  console.log("Server started on Port:", PORT.yellow.bold);
});
