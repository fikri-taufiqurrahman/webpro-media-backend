import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import { Message } from './models/index.js'; 

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);  // Menghubungkan Socket.io ke server HTTP

const uploadsPath = path.resolve("./uploads");
const publicPath = path.resolve("./public")
app.use("/uploads", express.static(uploadsPath));
app.use("/public", express.static(publicPath));

// Connect to MySQL
connectDB();

// Routes
app.use("/", authRoutes, userRoutes, postRoutes, followRoutes, chatRoutes);

// Socket.io (WebSocket) untuk komunikasi chat real-time
io.on('connection', (socket) => {
    console.log('Pengguna terhubung ke WebSocket');

    socket.on('chat message', async (msg) => {
        const { senderId, receiverId, messageText } = msg;

        try {
            // Buat pesan baru dalam database
            const newMessage = await Message.create({
                senderId,
                receiverId,
                messageText,
            });

            // Emit pesan baru ke semua klien yang terhubung
            io.emit('chat message', newMessage);
        } catch (error) {
            console.error('Gagal mengirim pesan:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Pengguna terputus dari WebSocket');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
