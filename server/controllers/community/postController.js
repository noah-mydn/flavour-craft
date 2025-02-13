const Post = require("../../models/community/Posts");
const Comment = require("../../models/community/Comments");
const Notification = require("../../models/community/Notification");

exports.createPost = async (req, res) => {
  try {
    const { user, topic, description, tags } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    const newPost = new Post({
      user,
      topic,
      description,
      image: imageUrl,
      tags,
    });
    await newPost.save();
    res.status(201).json({
      status: 201,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName")
      .populate("comments.user", "firstName");
    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
};

exports.getTrendingPosts = async (req, res) => {
  const day = new Date();
  day.setHours(day.getHours() - 24);
  try {
    const posts = await Post.aggregate([
      { $match: { createdAt: { $gte: day } } },
      {
        $addFields: {
          upvoteCount: { $size: "$upvotes" },
          downvoteCount: { $size: "$downvotes" },
          netVoteCount: {
            $subtract: [{ $size: "$upvotes" }, { $size: "$downvotes" }],
          },
        },
      },
      { $sort: { netVoteCount: -1 } },
    ]);

    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve trending posts",
      error: error.message,
    });
  }
};

exports.getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $addFields: { upVoteCount: { $size: "$upvotes" } } },
      { $sort: { upVoteCount: -1 } },
    ]);
    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve popular posts",
      error: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "firstName")
      .populate("comments.user", "firstName");

    if (!post)
      return res.status(404).json({
        status: 404,
        message: "Post not found",
        post: post,
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve post",
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { topic, description, tags } = req.body;
    let updatedFields = { topic, description, tags };
    if (req.file) {
      updatedFields.image = req.file.path;
    }
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      updatedFields,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    res.status(204).json({
      status: 204,
      message: "Post updated successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

exports.addComment = async (req, res) => {
  console.log("Commented User:", req.user);
  try {
    const { userId, content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    const newComment = new Comment({
      postId,
      userId,
      content,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    //send noti to post's author
    if (post.user._id.toString() != userId) {
      const noti = new Notification({
        user: post.user._id,
        type: "comment",
        message: `${req.user.firstName} left a comment on your post.`,
        link: `/post/${postId}`,
        isRead: false,
      });
      await noti.save();
    }

    res.status(201).json({
      status: 201,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: 404,
        message: "Comment not found",
      });
    }
    if (comment.userId != req.user.userId) {
      console.log(req);
      return res.status(403).json({
        commentedUser: comment.userId,
        loggedUser: req.user.userId,
        status: 403,
        message: "You are not authorized to delete this comment",
      });
    }
    if (comment.postId != postId) {
      return res.status(400).json({
        status: 400,
        message: "Comment does not belong to this post",
      });
    }
    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });
    res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    if (!post.upvotes.includes(user)) {
      post.upvotes.push(user);
      post.downvotes = post.downvotes.filter((id) => id != user);
    }
    await post.save();
    res.status(200).json({
      status: 200,
      message: "Post upvoted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to upvote post",
      error: error.message,
    });
  }
};

exports.downvotePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    if (!post.downvotes.includes(user)) {
      post.downvotes.push(user);
      post.upvotes = post.upvotes.filter((id) => id != user);
    }
    await post.save();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to downvote post",
      error: error.message,
    });
  }
};

exports.deleteUpVote = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    if (post.upvotes.includes(user)) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== user.toString()
      );
      await post.save();
      return res.status(200).json({
        status: 200,
        message: "Upvote removed successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "User has not upvoted this post",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to remove upvote",
      error: error.message,
    });
  }
};

exports.deleteDownVote = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    if (post.downvotes.includes(user)) {
      post.downvotes = post.downvotes.filter(
        (id) => id.toString() !== user.toString()
      );
      await post.save();
      return res.status(200).json({
        status: 200,
        message: "Downvote removed successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "User has not downvoted this post",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to remove downvote",
      error: error.message,
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 200,
      notifications: notifications,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: error.message });
  }
};
