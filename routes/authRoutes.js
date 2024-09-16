import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleCallback
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Route untuk login menggunakan Google
router.get('/auth/google', googleLogin);

// Route untuk callback setelah login Google
router.get('/auth/google/callback', googleCallback);


export default router;
