const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    commentableType: {
      type: String,
      required: [true, "commentableType is required"],
    },
    commentableId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "commentableType",
      required: [true, "commentableId is required"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
