const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    topicsCompleted: {
      type: Number,
      default: 0
    },

    totalTopics: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Subject", subjectSchema);