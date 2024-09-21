import { Story, User, Viewer } from "../models/index.js";
import { Op } from "sequelize";

export const getFollowingStories = async (req, res) => {
  const { id: userId } = req.user;

  try {
    // Ambil daftar pengguna yang diikuti
    const following = await Follow.findAll({
      where: {
        followerId: userId,
      },
      attributes: ['followingId'],
    });

    const followingIds = following.map(f => f.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json({
        message: 'No stories available',
        stories: [],
      });
    }

    // Ambil story dari pengguna yang diikuti, pastikan belum expired
    const stories = await Story.findAll({
      where: {
        userId: {
          [Op.in]: followingIds,
        },
        expireAt: {
          [Op.gt]: new Date(), // Story yang belum expired
        },
      },
      include: [{
        model: User,
        attributes: ['id', 'username', 'profilePicture'],
      }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Stories fetched successfully',
      stories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error fetching stories',
      error: error.message,
    });
  }
};


export const addStory = async (req, res) => {
    const { content } = req.body;
    const { id: userId } = req.user;

    try {
        let storyContent = content
        if (req.file) {
          storyContent = `/uploads/${req.file.fieldname}/${req.file.filename}`;
        }

      const expireAt = new Date();
      expireAt.setHours(expireAt.getHours() + 24);

      // Membuat story baru
      const newStory = await Story.create({
        content: storyContent,
        expireAt,
        userId,
      });

      return res.status(201).json({
        message: 'Story added successfully',
        story: newStory,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error adding story',
        error: error.message,
      });
    }
};


export const deleteStory = async (req, res) => {
    const { storyId } = req.params;
    const {id: userId} = req.user;  
  
    try {
      const story = await Story.findOne({
        where: {
          id: storyId,
          userId: userId,  
        },
      });
  
      if (!story) {
        return res.status(404).json({
          message: 'Story not found or not authorized to delete',
        });
    }  
      await story.destroy();
  
      return res.status(200).json({
        message: 'Story deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error deleting story',
        error: error.message,
      });
    }
  };


  export const addSeenStory = async (req, res) => {
    const { storyId } = req.body;
    const { id: userId } = req.user;
  
    try {
      const story = await Story.findOne({
        where: {
          id: storyId,
          expireAt: {
            [Op.gt]: new Date() 
          }
        }
      });
  
      if (!story) {
        return res.status(404).json({
          message: 'Story not found or has expired',
        });
      }
  
      const existingViewer = await Viewer.findOne({
        where: {
          storyId,
          userId,
        }
      });
  
      if (existingViewer) {
        return res.status(200).json({
          message: 'Story already seen',
        });
      }
  
      const newViewer = await Viewer.create({
        storyId,
        userId,
        viewedAt: new Date(),
      });
  
      return res.status(201).json({
        message: 'Story seen successfully',
        viewer: newViewer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error marking story as seen',
        error: error.message,
      });
    }
  };

  
  const getSeenStory = async (storyId) => {
    try {
      const viewers = await Viewer.findAll({
        where: {
          storyId: storyId,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'name', 'profilePicture'], 
          },
        ],
      });
  
      return viewers; 
    } catch (error) {
      console.error('Error fetching seen story data:', error);
      throw error;
    }
  };
  
  export default getSeenStory;