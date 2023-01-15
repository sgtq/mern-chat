import express from "express";
import { register, login } from "../controllers/AuthController.js";
import { getAllUsers } from "../controllers/userController.js";
import { authValidate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authValidate, getAllUsers).post(register);
router.post("/login", login);

export default router;
