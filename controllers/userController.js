import { User, Post, Follow } from "../models/index.js";
import fs from "fs/promises";
import path from "path";
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Dapatkan informasi pengguna
    const user = await User.findOne({
      where: { username },
      attributes: ["id", "name", "username", "bio", "profilePicture"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const postList = await Post.findAll({
      where: { userId: user.id },
    });

    const totalPosts = await Post.count({
      where: { userId: user.id },
    });

    const totalFollowers = await Follow.count({
      where: { followingId: user.id },
    });

    const totalFollowing = await Follow.count({
      where: { followerId: user.id },
    });

    res.json({
      name: user.name,
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      postList: postList,
      totalPosts,
      totalFollowers,
      totalFollowing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, bio } = req.body;
    let profilePicture;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      profilePicture = `/uploads/profilePicture/${req.file.filename}`;

      // Hapus file gambar lama jika ada
      if (user.profilePicture) {
        const oldProfilePicturePath = path.resolve(
          `./uploads/profilePicture/${path.basename(user.profilePicture)}`,
        );
        try {
          await fs.access(oldProfilePicturePath); // Cek apakah file ada
          await fs.unlink(oldProfilePicturePath); // Hapus file
        } catch (error) {
          console.warn(
            `Profile picture file not found: ${oldProfilePicturePath}`,
          );
        }
      }
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.status(200).json({ message: "User info successfully updated" });
  } catch (error) {
    // Log error dan kirim respon 500
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
