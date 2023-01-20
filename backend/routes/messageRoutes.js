import express from "express";
import { getAllMessages, sendMessage } from "../controllers/MessageController.js";
import { authValidate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authValidate, sendMessage);
router.get("/:chatId", authValidate, getAllMessages);

export default router;
