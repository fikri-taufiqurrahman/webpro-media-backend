import { Like, Post, User, Comment } from "../models/index.js";
import { Op } from 'sequelize';
export const getFollowingPost = async (req, res) => {
    try {
      const { id: userId } = req.user;  
  
      const followingUsers = await Follow.findAll({
        where: { followerId: userId },
        attributes: ['followingId'],  
      });
  
      if (followingUsers.length === 0) {
        return res.status(200).json({ message: "You are not following anyone", posts: [] });
      }
  
      const followingIds = followingUsers.map(follow => follow.followingId);
  
      const posts = await Post.findAll({
        where: {
          userId: { [Op.in]: followingIds }, 
        },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM Likes AS like
                WHERE like.postId = Post.id
              )`),
              'totalLikes'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM Comments AS comment
                WHERE comment.postId = Post.id
              )`),
              'totalComments'
            ]
          ]
        },
        include: [
          {
            model: User,  
            attributes: ['id', 'username', 'profilePicture']
          },
          {
            model: Comment,  
            attributes: ['id', 'commentText', 'createdAt'],
            include: [{
              model: User,
              attributes: ['id', 'username', 'profilePicture'],  
            }]
          }
        ],
        order: [['createdAt', 'DESC']]  
      });
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const addPost = async (req, res) => {
  try {
    const { id } = req.user;
    const { content, description } = req.body;
    let postContent = content;
    console.log(req.body);
    if (req.file) {
      postContent = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    }

    const post = await Post.create({
      content: postContent,
      description: description,
      userId: id,
    });

    res.status(201).json({
      message: "Post added successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOnePostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const likePostCount = await Like.count({
      where: { postId: post.id },
    });
    const comments = await Comment.findAll({
      where: { postId: post.id },
      include: [
        {
          model: User,
          attributes: ["username", "profilePicture"],
        },
      ],
    });
    const commentCount = comments.length;

    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const likeCommentCount = await Like.count({
          where: { commentId: comment.id },
        });

        return {
          ...comment.toJSON(),
          likeCommentCount,
        };
      }),
    );

    res.json({
      postId: post.id,
      content: post.content,
      description: post.description,
      updatedAt: post.updatedAt,
      likePostCount: likePostCount,
      commentCount: commentCount,
      comments: commentsWithLikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { postId } = req.params;
    const { description } = req.body;

    const post = await Post.findOne({
      where: { id: postId, userId: userId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.description = description;

    await post.save();

    res.status(200).json({ message: "Post successfully updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { postId } = req.params;

    const post = await Post.findOne({
      where: { id: postId, userId: userId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.user;
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = await Like.findOne({
      where: { userId: id, postId },
    });

    if (like) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    await Like.create({
      userId: id,
      postId: post.id,
    });

    res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelLikePost = async (req, res) => {
  try {
    const { id } = req.user;
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = await Like.findOne({
      where: { userId: id, postId },
    });

    if (!like) {
      return res.status(400).json({ message: "User has not liked this post" });
    }

    await like.destroy();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { postId } = req.params;
    const { commentText } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      commentText,
      postId,
      userId,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingLike = await Like.findOne({
      where: {
        commentId,
        userId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this comment" });
    }

    const like = await Like.create({
      commentId,
      userId,
    });

    res.status(201).json({
      message: "Comment liked successfully",
      like,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelLikeComment = async (req, res) => {
    try {
        const { id: userId } = req.user; // Mendapatkan userId dari token autentikasi
        const { commentId } = req.params; // Mengambil commentId dari parameter URL
    
        // Verifikasi apakah komentar yang ingin di-unlike ada
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
        }
    
        // Cek apakah pengguna sudah menyukai komentar ini
        const existingLike = await Like.findOne({
          where: {
            commentId,
            userId,
          },
        });
    
        if (!existingLike) {
          return res.status(400).json({ message: "You have not liked this comment yet" });
        }
    
        // Hapus like dari database
        await existingLike.destroy();
    
        res.status(200).json({ message: "Comment like removed successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
  };

export const deleteComment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { commentId } = req.params;

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        userId: userId,
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json({
          message:
            "Comment not found or you do not have permission to delete this comment",
        });
    }

    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
