import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadStory } from "../middleware/uploadMiddleware.js";
import {
  addStory,
  deleteStory,
  getFollowingStories,
  addSeenStory,
  getSeenStory,
} from "../controllers/storyController.js";

const router = express.Router();

router.get('/story', authMiddleware, getFollowingStories)
router.post('/story', authMiddleware, uploadStory.single("storyContent"), addStory)
router.delete('/story', authMiddleware, deleteStory)
router.post("/seen-story", authMiddleware, addSeenStory)
router.get("/seen-story/:storyId", authMiddleware, getSeenStory)






export default router;
