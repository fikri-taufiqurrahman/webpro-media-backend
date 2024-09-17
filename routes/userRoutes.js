import express from "express";
import {
  getUserByUsername,
  updateUserProfile,
  searchUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadPhoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/user-profile/:username", getUserByUsername);
router.put(
  "/user-profile",
  authMiddleware,
  uploadPhoto.single("profilePicture"),
  updateUserProfile,
);
router.get("/search-user/:username", searchUser)

export default router;
