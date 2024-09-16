import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoutes.js";


import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

const uploadsPath = path.resolve("./uploads");
app.use("/uploads", express.static(uploadsPath));
// Connect to MySQL
connectDB();

// Routes
app.use("/", authRoutes, userRoutes, postRoutes, followRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
