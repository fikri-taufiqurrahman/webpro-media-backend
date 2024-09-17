import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

// Route untuk mengirim pesan
router.post("/chat", sendMessage);

// Route untuk mendapatkan semua pesan antara dua pengguna
router.get("/chat/:senderId/:receiverId", getMessages);

export default router;