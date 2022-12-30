const express = require("express");
const { postController } = require("../controllers");
const { validateModelId } = require("../validators/model");
const uploadFile = require("../utils/fileUploadCloudinary");
const { authorized, authorizedOnModel } = require("../middlewares/auth");

const {
  addPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  addCommentOnPost,
  addOrRemoveLikeOnPost,
  getUserPosts,
} = postController;

const router = express.Router();

router.param("postId", validateModelId("Post"));

router.route("/").get(getPosts).post(authorized, uploadFile, addPost);
router
  .route("/:postId")
  .get(getPostById)
  .put(
    authorized,
    authorizedOnModel("Post", "postId", "author"),
    uploadFile,
    updatePost
  )
  .delete(
    authorized,
    authorizedOnModel("Post", "postId", "author"),
    deletePost
  );

router.route("/comment/:postId").post(authorized, addCommentOnPost);
router.route("/like/:postId").post(authorized, addOrRemoveLikeOnPost);
router.route("/user/articles").get(authorized, getUserPosts);

module.exports = router;
