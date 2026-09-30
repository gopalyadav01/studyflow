const express = require("express");
const StudySession = require("../models/StudySession");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all study sessions
router.get("/", protect, async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.user
    })
      .populate("subject", "name")
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch study sessions",
      error: error.message
    });
  }
});

// Add a study session
router.post("/", protect, async (req, res) => {
  try {
    const { subject, duration, date } = req.body;

    if (!duration) {
      return res.status(400).json({
        message: "Study duration is required"
      });
    }

    const session = await StudySession.create({
      user: req.user,
      subject: subject || undefined,
      duration,
      date: date || new Date()
    });

    const populatedSession = await session.populate(
      "subject",
      "name"
    );

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add study session",
      error: error.message
    });
  }
});

// Delete a study session
router.delete("/:id", protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!session) {
      return res.status(404).json({
        message: "Study session not found"
      });
    }

    await session.deleteOne();

    res.json({
      message: "Study session deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete study session",
      error: error.message
    });
  }
});

module.exports = router;