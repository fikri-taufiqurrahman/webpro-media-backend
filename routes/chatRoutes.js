import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, sendMessage);

// Route untuk mendapatkan semua pesan antara dua pengguna
router.get("/chat/:senderId/:receiverId", getMessages);

export default router;