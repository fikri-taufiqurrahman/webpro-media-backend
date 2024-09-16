import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadPost } from "../middleware/uploadMiddleware.js";
import {
  addPost,
  getOnePostById,
  updatePost,
  deletePost,
} from "../controllers/postControllers.js";

const router = express.Router();

router.post("/post", authMiddleware, uploadPost.single("postContent"), addPost);
router.get("/post/:id", authMiddleware, getOnePostById);
router.put("/post/:id", authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);

export default router;
