import { Like, Post, User, Comment } from "../models/index.js";

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
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id },
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
          attributes: ["username", "profilPicture"],
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
    const { id } = req.params;
    const { description } = req.body;

    const post = await Post.findOne({
      where: { id },
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
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Like.destroy({
      where: { postId: post.id },
    });

    await Comment.destroy({
      where: { postId: post.id },
    });

    await post.destroy();

    res
      .status(200)
      .json({ message: "Post and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
