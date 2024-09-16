import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadPost } from "../middleware/uploadMiddleware.js";
import {
  getAllFollowingPost,
  addPost,
  getOnePostById,
  updatePost,
  deletePost,
  likePost,
  cancelLikePost,
  addComment,
  likeComment,
  cancelLikeComment,
  deleteComment,
} from "../controllers/postControllers.js";

const router = express.Router();

router.get("/post", authMiddleware, getAllFollowingPost);

router.post("/post", authMiddleware, uploadPost.single("postContent"), addPost);
router.get("/post/:postId", getOnePostById);
router.put("/post/:postId", authMiddleware, updatePost);
router.delete("/post/:postId", authMiddleware, deletePost);
router.post("/post/:postId/like", authMiddleware, likePost);
router.delete("/post/:postId/cancel-like", authMiddleware, cancelLikePost);
router.post("/post/:postId/add-comment", authMiddleware, addComment);
router.post("/post/like-comment/:commentId", authMiddleware, likeComment);
router.delete("/post/cancel-like-comment/:commentId", authMiddleware, cancelLikeComment);
router.delete("/post/delete-comment/:commentId", authMiddleware, deleteComment);

export default router;
