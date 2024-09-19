import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// Register User
export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah user ada
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Buat JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Cek apakah user ada
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Buat token reset password
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token kadaluarsa dalam 1 jam
    });

    // Kirim email reset password (konfigurasi transporter nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Cari user berdasarkan ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// login with google
// Konfigurasi OAuth 2.0 Google
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// URL untuk otorisasi Google
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

// Login menggunakan Google
export const googleLogin = (req, res) => {
  res.redirect(authorizationUrl);
};

// Callback setelah login Google berhasil
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Ambil token akses menggunakan kode otorisasi
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Dapatkan informasi user dari Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res
        .status(400)
        .json({ message: "Email atau nama tidak ditemukan" });
    }

    // Cek apakah user sudah ada berdasarkan email
    let user = await User.findOne({ where: { email: data.email } });

    // Jika user belum ada, buat user baru
    if (!user) {
      const username = `${data.name.replace(/\s+/g, "").toLowerCase()}${uuidv4().slice(0, 4)}`;

      user = await User.create({
        username: username,
        name: data.name,
        email: data.email,
        profilePicture: "/uploads/profilePicture/default.jpg",
        password: bcrypt.hashSync(data.id, 10), // Password di-hash menggunakan id Google
      });
    }

    // Generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google login failed" });
  }
};
