"use strict";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import postRoutes from "../routes/postRoutes.js";
import followRoutes from "../routes/followRoutes.js";
import chatRoutes from "../routes/chatRoutes.js";
import storyRoutes from "../routes/storyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const publicPath = path.resolve("./public");
app.use("/public", express.static(publicPath));

connectDB();

app.use(
  "/",
  authRoutes,
  userRoutes,
  postRoutes,
  followRoutes,
  chatRoutes,
  storyRoutes
);

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

export default app;
