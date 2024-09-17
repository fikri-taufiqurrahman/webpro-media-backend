import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadStory } from "../middleware/uploadMiddleware.js";
import {
  addStory,
  deleteStory,
} from "../controllers/postControllers.js";

const router = express.Router();


router.post('/story', authMiddleware, uploadStory("storyContent"), addStory)
router.delete('/story', authMiddleware, deleteStory)






export default router;
