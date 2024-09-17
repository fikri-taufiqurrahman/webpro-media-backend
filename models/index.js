import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// User Model
const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

// Post Model
const Post = sequelize.define(
  "Post",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Comment Model
const Comment = sequelize.define(
  "Comment",
  {
    commentText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Like Model
const Like = sequelize.define(
  "Like",
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Post,
        key: "id",
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Comment,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Story Model
const Story = sequelize.define(
  "Story",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Viewer = sequelize.define(
  "Viewer",
  {
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Story,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,  
  }
);


// Follow Model
const Follow = sequelize.define(
  "Follow",
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Message Model
const Message = sequelize.define(
  "Message",
  {
    messageText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Define associations
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });

Comment.hasMany(Like, { foreignKey: 'commentId', onDelete: 'CASCADE' });
Like.belongsTo(Comment, { foreignKey: 'commentId' });

User.hasMany(Story, { foreignKey: "userId" });
Story.belongsTo(User, { foreignKey: "userId" });

Story.hasMany(Viewer, { foreignKey: 'storyId', onDelete: 'CASCADE' });
Viewer.belongsTo(Story, { foreignKey: 'storyId' });

User.hasMany(Viewer, { foreignKey: 'userId', onDelete: 'CASCADE' });
Viewer.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Follow, { as: "Followers", foreignKey: "followerId" });
User.hasMany(Follow, { as: "Following", foreignKey: "followingId" });


// Follow Model
Follow.belongsTo(User, {
  foreignKey: "followerId",
  as: "Follower",  // Alias untuk pengguna yang mengikuti
});

Follow.belongsTo(User, {
  foreignKey: "followingId",
  as: "Following",  // Alias untuk pengguna yang diikuti
});

User.hasMany(Message, { as: "SentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "receiverId" });
Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

export { User, Post, Comment, Like, Story, Viewer, Follow, Message };
