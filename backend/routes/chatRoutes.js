import express from "express";
import {
    accessChat,
    addToGroup,
    createGroupChat,
    fetchChats,
    removeFromGroup,
    renameGroupChat,
} from "../controllers/ChatController.js";
import { authValidate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authValidate, fetchChats);
router.post("/", authValidate, accessChat);
router.post("/group", authValidate, createGroupChat);
router.put("/group-rename", authValidate, renameGroupChat);
router.put("/group-remove", authValidate, removeFromGroup);
router.put("/group-add", authValidate, addToGroup);

export default router;
