import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addFollowing,
    deleteFollowing,
    deleteFollower,
    followersList,
    followingList
  } from "../controllers/followControllers.js";

  const router = express.Router();

  router.post("/following",authMiddleware, addFollowing)
  router.delete('/following/:followingId',authMiddleware, deleteFollowing)
  router.delete("/follower/:followerId", authMiddleware ,deleteFollower)
  router.get("/follower", authMiddleware, followersList)
  router.get("/following", authMiddleware, followingList)

  export default router;