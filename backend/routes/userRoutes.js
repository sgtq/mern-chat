import express from "express";
import { register, login } from "../controllers/AuthController.js";
import { getAllUsers } from "../controllers/userController.js";
import { authValidate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authValidate, getAllUsers);
router.post("/", register);
router.post("/login", login);

export default router;
