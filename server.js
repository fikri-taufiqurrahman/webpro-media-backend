import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./config/db.js";
import socketSetup from "./socket.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import storyRoutes from './routes/storyRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);  

socketSetup(io);

app.use((req, res, next) => {
    req.io = io;  
    next();
});

const uploadsPath = path.resolve("./uploads");
const publicPath = path.resolve("./public")
app.use("/uploads", express.static(uploadsPath));
app.use("/public", express.static(publicPath));

connectDB();

app.use("/", authRoutes, userRoutes, postRoutes, followRoutes, chatRoutes, storyRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
