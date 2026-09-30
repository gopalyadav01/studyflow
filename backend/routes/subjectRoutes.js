const express = require("express");

const Subject = require("../models/Subject");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== GET ALL SUBJECTS ====================

router.get("/", protect, async (req, res) => {
  try {
    const subjects = await Subject.find({
      user: req.user
    }).sort({ createdAt: -1 });

    res.json(subjects);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message
    });
  }
});


// ==================== ADD SUBJECT ====================

router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      progress,
      topicsCompleted,
      totalTopics
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required"
      });
    }

    const subject = await Subject.create({
      user: req.user,
      name,
      progress: progress || 0,
      topicsCompleted: topicsCompleted || 0,
      totalTopics: totalTopics || 0
    });

    res.status(201).json(subject);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add subject",
      error: error.message
    });
  }
});


// ==================== UPDATE SUBJECT ====================

router.put("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    const {
      name,
      progress,
      topicsCompleted,
      totalTopics
    } = req.body;

    subject.name = name ?? subject.name;
    subject.progress = progress ?? subject.progress;
    subject.topicsCompleted =
      topicsCompleted ?? subject.topicsCompleted;
    subject.totalTopics =
      totalTopics ?? subject.totalTopics;

    await subject.save();

    res.json(subject);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update subject",
      error: error.message
    });
  }
});


// ==================== DELETE SUBJECT ====================

router.delete("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    await subject.deleteOne();

    res.json({
      message: "Subject deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message
    });
  }
});


module.exports = router;