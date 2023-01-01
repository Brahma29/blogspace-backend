/* eslint-disable no-underscore-dangle */
const { Post, Comment } = require("../models");
const { success, failure } = require("../utils/responseHelper");

const defaultPostCover =
  "https://www.noage-official.com/wp-content/uploads/2020/06/placeholder.png";

const addPost = async (req, res, next) => {
  try {
    let fileUrl;
    if (req.file) {
      fileUrl = req.file.url;
    }
    const { user, body } = req;
    const { title, article } = body;
    await Post.create({
      author: user._id,
      title,
      article,
      cover: fileUrl ? fileUrl : defaultPostCover,
    });
    return success(res, "Post added successfully", undefined, 201);
  } catch (error) {
    console.log(error);
    next(error);
  }
  return undefined;
};

const updatePost = async (req, res, next) => {
  try {
    const file = req.file;
    const { body } = req;
    console.log({ body });
    const { title, article } = body;
    const post = await Post.findById(req.params.postId);
    if (file) {
      post.cover = file.url;
    }
    post.title = title || post.title;
    post.article = article || post.article;
    await post.save();
    return success(res, "Post updated successfully", undefined, 200);
  } catch (error) {
    console.log(error);
    next(error);
  }
  return undefined;
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    post.deleted = true;
    await post.save();
    return success(res, "Post removed successfully", undefined, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const getPosts = async (req, res, next) => {
  try {
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Post.countDocuments({ ...keyword });
    const posts = await Post.find({ deleted: false, ...keyword })
      .populate({
        path: "author",
        select: "first_name last_name",
      })
      .populate({
        path: "likes",
        select: "first_name last_name",
      })
      .populate({
        path: "comments",
        select: "comment author",
        populate: {
          path: "author",
          model: "User",
          select: "first_name last_name",
        },
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const pages = Math.ceil(count / pageSize);

    return success(
      res,
      "Posts fetched successfully",
      { posts, page, pages },
      200
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
  return undefined;
};

const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({
      deleted: false,
      author: req.user._id,
    })
      .populate({
        path: "author",
        select: "first_name last_name",
      })
      .populate({
        path: "likes",
        select: "first_name last_name",
      })
      .populate({
        path: "comments",
        select: "comment author",
        populate: {
          path: "author",
          model: "User",
          select: "first_name last_name",
        },
      });
    return success(res, "Posts fetched successfully", posts, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate({
        path: "author",
        select: "first_name last_name",
      })
      .populate({
        path: "likes",
        select: "first_name last_name",
      })
      .populate({
        path: "comments",
        select: "comment author",
        populate: {
          path: "author",
          model: "User",
          select: "first_name last_name",
        },
      });

    return success(res, "Post fetched successfully", post, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const addCommentOnPost = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const alreadyCommented = await Comment.findOne({
      author: req.user._id,
      commentableType: "Post",
      commentableId: req.params.postId,
    });

    if (!alreadyCommented) {
      const commented = await Comment.create({
        author: req.user._id,
        comment,
        commentableType: "Post",
        commentableId: req.params.postId,
      });
      const post = await Post.findById(req.params.postId);
      post.comments.push(commented._id);
      await post.save();
      return success(res, "Comment added successfully", undefined, 201);
    }

    return failure(res, "Comment already exists", 400);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const addOrRemoveLikeOnPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    const alreadyLikedIndex = post.likes.findIndex(
      (userId) => req.user._id === userId.toString()
    );
    if (alreadyLikedIndex !== -1) {
      post.likes = [
        ...post.likes.slice(0, alreadyLikedIndex),
        ...post.likes.slice(alreadyLikedIndex + 1),
      ];
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    return success(
      res,
      `${alreadyLikedIndex !== -1 ? "Like removed" : "Like added"}`,
      undefined,
      200
    );
  } catch (error) {
    next(error);
  }
  return undefined;
};

module.exports = {
  addPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  addCommentOnPost,
  addOrRemoveLikeOnPost,
  getUserPosts,
};
