const express = require("express");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET current user's profile/settings
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile",
      error: error.message
    });
  }
});

// UPDATE current user's profile/settings
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      name,
      dailyGoal,
      notifications,
      darkMode
    } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (dailyGoal !== undefined) {
      user.dailyGoal = Number(dailyGoal);
    }

    if (notifications !== undefined) {
      user.notifications = Boolean(notifications);
    }

    if (darkMode !== undefined) {
      user.darkMode = Boolean(darkMode);
    }

    await user.save();

    res.json({
      message: "Settings updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyGoal: user.dailyGoal,
        notifications: user.notifications,
        darkMode: user.darkMode
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings",
      error: error.message
    });
  }
});

module.exports = router;