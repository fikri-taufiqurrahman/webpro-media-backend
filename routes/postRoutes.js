import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadPost } from "../middleware/uploadMiddleware.js";
import {
  addPost,
  getOnePostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  likeComment,
  deleteComment,
} from "../controllers/postControllers.js";

const router = express.Router();

router.post("/post", authMiddleware, uploadPost.single("postContent"), addPost);
router.get("/post/:postId", authMiddleware, getOnePostById);
router.put("/post/:postId", authMiddleware, updatePost);
router.delete("/post/:postId", authMiddleware, deletePost);
router.post("/post/:postId/like", authMiddleware, likePost);
router.delete("/post/:postId/unlike", authMiddleware, unlikePost);
router.post("/post/:postId/add-comment", authMiddleware, addComment);
router.post("/post/like-comment/:commentId", authMiddleware, likeComment);
router.delete("/post/delete-comment/:commentId", authMiddleware, deleteComment);

export default router;
