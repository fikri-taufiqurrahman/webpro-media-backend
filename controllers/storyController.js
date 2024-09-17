import { Story, User, Viewer } from "../models/index.js";

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