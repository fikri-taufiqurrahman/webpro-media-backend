import { Follow, User } from "../models/index.js";


export const addFollowing = async (req, res) => {
    try {
        const { followingId } = req.body; 
        const { id: followerId } = req.user; 

        if (followerId === followingId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await Follow.findOne({
            where: { followerId, followingId }
        });

        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        await Follow.create({
            followerId,
            followingId
        });

        res.status(200).json({ message: "Successfully followed the user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteFollowing = async (req, res) => {
    try {
        const { followingId } = req.params;
        const { id: followerId } = req.user; 

        const follow = await Follow.findOne({
            where: { followerId, followingId }
        });

        if (!follow) {
            return res.status(404).json({ message: "You are not following this user" });
        }

        await Follow.destroy({
            where: { followerId, followingId }
        });

        res.status(200).json({ message: "Successfully unfollowed the user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteFollower = async (req, res) => {
    try {
        const { followerId } = req.params; 
        const { id: followingId } = req.user; 

        const follow = await Follow.findOne({
            where: { followerId, followingId }
        });

        if (!follow) {
            return res.status(404).json({ message: "This user is not following you" });
        }

        await Follow.destroy({
            where: { followerId, followingId }
        });

        res.status(200).json({ message: "Successfully removed follower" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Mendapatkan daftar followers
export const followersList = async (req, res) => {
    try {
        const { userId } = req.params;
        const followers = await Follow.findAll({
            where: { followingId: userId },  
            include: [{
                model: User,  
                as: "Follower",  // Alias yang benar
                attributes: ['id', 'username', 'profilePicture'],  
            }]
        });

        res.status(200).json({ followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Mendapatkan daftar following
export const followingList = async (req, res) => {
    try {
        const { userId } = req.params; 
        const following = await Follow.findAll({
            where: { followerId: userId },  
            include: [{
                model: User,  
                as: "Following",  // Alias yang benar
                attributes: ['id', 'username', 'profilePicture'],  
            }]
        });

        res.status(200).json({ following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};