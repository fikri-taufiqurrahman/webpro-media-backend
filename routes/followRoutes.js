import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addFollowing,
    deleteFollowing,
    deleteFollower
  } from "../controllers/followControllers.js";

  const router = express.Router();

  router.post("/following",authMiddleware, addFollowing)
  router.delete('/following/:followingId',authMiddleware, deleteFollowing)
  router.delete("/follower/:followerId", authMiddleware ,deleteFollower)



  export default router;