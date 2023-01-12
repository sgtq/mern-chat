import express from "express";
import { register, login } from "../controllers/AuthController.js";

const router = express.Router();
console.log("TESTING");

router.post("/", register);
router.post("/login", login);

export default router;
