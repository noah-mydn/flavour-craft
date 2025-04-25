const Post = require("../../models/community/Posts");
const Comment = require("../../models/community/Comments");
const User = require("../../models/Users");
const Notification = require("../../models/community/Notification");
const Report = require("../../models/community/Reports");
const cloudinary = require("cloudinary").v2;

exports.createPost = async (req, res) => {
  try {
    const user = req.user.userId;
    const { topic, description, tags } = req.body;
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const totalImages = imageUrls?.length;
    if (totalImages > 5) {
      return res.status(400).json({
        message: "You can only have a maximum of 5 images per post.",
      });
    }

    //check topic, descriptions are there
    if (!topic) {
      return res
        .status(400)
        .json({ message: "You need to have a topic title" });
    }
    if (!description) {
      return res.status(400).json({ message: "You need to add description" });
    }
    const newPost = new Post({
      author: user,
      topic,
      description,
      images: imageUrls,
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
    let { page = 1, pageSize = 10, sort = "recent" } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const skip = (page - 1) * pageSize;

    console.log("Query Parameters:", req.query);

    let posts, totalCount;

    switch (sort) {
      case "trending": {
        const since = new Date();
        since.setHours(since.getHours() - 24);

        // match last 24h, compute net votes
        const agg = await Post.aggregate([
          { $match: { createdAt: { $gte: since } } },
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
          { $skip: skip },
          { $limit: pageSize },
        ]);
        posts = agg;
        totalCount = await Post.countDocuments({ createdAt: { $gte: since } });
        break;
      }

      case "popular": {
        // sort by total upvotes
        const agg = await Post.aggregate([
          { $addFields: { upvoteCount: { $size: "$upvotes" } } },
          { $sort: { upvoteCount: -1 } },
          { $skip: skip },
          { $limit: pageSize },
        ]);
        posts = agg;
        totalCount = await Post.countDocuments();
        break;
      }

      case "recent":
      default: {
        // default: newest first
        posts = await Post.find()
          .sort({ createdAt: -1 })
          .populate("author", "firstName lastName userImg") // Check if 'author' is a valid ObjectId reference
          .skip(skip)
          .limit(pageSize);
        totalCount = await Post.countDocuments();
        break;
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to retrieve posts",
      error: error.message,
    });
  }
};

exports.getTrendingPosts = async (req, res) => {
  let { page, pageSize } = req.query;
  page = parseInt(page) || 1;
  pageSize = parseInt(pageSize) || 10;

  const skip = (page - 1) * pageSize;
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
    ])
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Post.countDocuments({ createdAt: { $gte: day } });

    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      posts: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
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
  let { page, pageSize } = req.query;
  page = parseInt(page) || 1;
  pageSize = parseInt(pageSize) || 10;

  const skip = (page - 1) * pageSize;
  try {
    const posts = await Post.aggregate([
      { $addFields: { upVoteCount: { $size: "$upvotes" } } },
      { $sort: { upVoteCount: -1 } },
    ])
      .skip(skip)
      .limit(pageSize);
    const totalCount = await Post.countDocuments();
    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
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

exports.getPostsByTags = async (req, res) => {
  let { page, pageSize } = req.query;
  page = parseInt(page) || 1;
  pageSize = parseInt(pageSize) || 10;

  const skip = (page - 1) * pageSize;
  try {
    const tags = req.query.tags.split(",");
    const posts = await Post.aggregate([
      {
        $match: {
          tags: { $in: tags },
        },
      },
      { $sort: { netVoteCount: -1 } },
    ])
      .skip(skip)
      .limit(pageSize);
    const totalCount = await Post.countDocuments({ tags: { $in: tags } });

    res.status(200).json({
      status: 200,
      message: "Posts retrieved successfully",
      posts: posts,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve posts by tags",
      error: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    console.time("getPostById Query");

    const post = await Post.findById(req.params.postId.toString()).populate(
      "author",
      "firstName lastName userImg"
    );

    console.timeEnd("getPostById Query");

    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: 200,
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve post",
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    // 1. Parse request data
    const { postId } = req.params;
    let { topic, description, tags, existingImages } = req.body;

    if (!Array.isArray(existingImages)) {
      existingImages = existingImages ? [existingImages] : [];
    }

    // 2. Get new files
    const newFiles = req.files || [];

    // Check total image count (max 5)
    const totalImages = existingImages.length + newFiles.length;
    if (totalImages > 5) {
      return res.status(400).json({
        message: "You can only have a maximum of 5 images per post.",
      });
    }

    // 3. Find original post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 4. Upload new images to Cloudinary
    const newImageUrls = await Promise.all(
      newFiles.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "flavourCraft_posts",
        });
        return result.secure_url;
      })
    );

    // 5. Identify images to delete
    const imagesToDelete = post.images.filter(
      (img) => !existingImages.includes(img)
    );

    // 6. Delete removed images from Cloudinary
    await Promise.all(
      imagesToDelete.map(async (url) => {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`flavourCraft_posts/${publicId}`);
      })
    );

    // 7. Update post with combined images
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        topic,
        description,
        tags,
        images: [...existingImages, ...newImageUrls],
      },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }

    // Check if the user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        status: 403,
        message: "You do not have permission to delete this post",
      });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      for (const imageUrl of post.images) {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public_id from URL
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Find and delete related comments
    const comments = await Comment.find({ postId: req.params.postId });

    for (const comment of comments) {
      // Delete comment images from Cloudinary
      if (comment.images && comment.images.length > 0) {
        for (const imageUrl of comment.images) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }
      // Delete notifications related to this comment
      await Notification.deleteMany({ commentId: comment._id });
    }

    // Delete all comments related to the post
    await Comment.deleteMany({ postId: req.params.postId });

    // Delete the post
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      status: 200,
      message:
        "Post, related comments, comment images & notifications deleted successfully",
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
    const author = req.user.userId;
    const { content } = req.body;
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
      author,
      content,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    // Fetch the commenter with profile data
    const commentedUser = await User.findById(author).select(
      "firstName lastName userImg"
    );
    console.log("Fetched Commented User:", commentedUser);

    // Send notification to post's author
    if (post.author.toString() !== author.toString()) {
      const notification = new Notification({
        author: post.author,
        type: "comment",
        commentedUser: {
          firstName: commentedUser.firstName,
          lastName: commentedUser.lastName,
          userImg: commentedUser.userImg,
        },
        message: `${commentedUser.firstName} left a comment on your post.`,
        link: `/post/${postId}`,
        isRead: false,
      });
      await notification.save();
    }

    res.status(201).json({
      status: 201,
      message: "Comment added successfully",
      comment: {
        postId,
        _id: newComment._id,
        content: newComment.content,
        author,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        status: 404,
        message: "Comment not found",
      });
    }

    if (comment.author._id.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 403,
        message: "You are not authorized to edit this comment",
      });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({
      status: 200,
      message: "Comment updated successfully",
      updatedComment: comment,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to update comment",
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
    if (comment.author._id != req.user.userId) {
      console.log(req);
      return res.status(403).json({
        commentedUser: comment.author._id,
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
      postId,
      commentId,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    // Fetch all comments
    const comments = await Comment.find({ postId })
      .populate("author", "firstName lastName userImg ")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve comments",
      error: error.message,
    });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }

    // already upvoted, remove upvote
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({
        status: 200,
        message: "Removed like from this post",
      });
    }

    // Otherwise, upvote
    post.upvotes.push(userId);
    await post.save();

    res.status(200).json({
      status: 200,
      message: "Liked this post",
      postId: post._id,
      userId: req.user.userId,
      upvotes: post.upvotes.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to like this post",
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
    const userId = req.user.userId;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: 404,
        message: "Post not found",
      });
    }
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const notifications = await Notification.find({
      author: req.user.userId,
      createdAt: { $gte: oneWeekAgo },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      notifications: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      //error: error.message,
    });
  }
};
