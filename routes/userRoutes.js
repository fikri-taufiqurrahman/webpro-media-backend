import express from "express"
import { getUserByUsername, updateUserProfile } from "../controllers/userController.js"
import { authMiddleware } from "../middleware/middleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/user-profile/:username', getUserByUsername);
router.put("/update-user-profile", authMiddleware, upload.single('profilePicture'), updateUserProfile)

export default router;