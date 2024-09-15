import { User } from '../models/index.js';

export const getUserByUsername = async(req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            where: { username },
            attributes: ['name', 'username', "bio", "profilePicture"],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async(req, res) => {
    try {
        const { id } = req.user;
        const { name, bio } = req.body;
        let profilePicture;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.file) {
            profilePicture = `/uploads/${req.file.filename}`;

            if (user.profilePicture && fs.existsSync(path.join(__dirname, '..', user.profilePicture))) {
                fs.unlinkSync(path.join(__dirname, '..', user.profilePicture));
            }
        }

        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;

        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        // Log error dan kirim respon 500
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};