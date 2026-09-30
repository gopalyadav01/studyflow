const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user })
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});

// Add a task
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      subject,
      priority,
      dueDate
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      user: req.user,
      title,
      subject: subject || undefined,
      priority: priority || "Medium",
      dueDate: dueDate || undefined
    });

    const populatedTask = await task.populate("subject", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add task",
      error: error.message
    });
  }
});

// Update a task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const {
      title,
      subject,
      priority,
      dueDate,
      completed
    } = req.body;

    task.title = title ?? task.title;
    task.subject = subject ?? task.subject;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;
    task.completed = completed ?? task.completed;

    await task.save();

    const populatedTask = await task.populate("subject", "name");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
});

// Delete a task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
  res.status(500).json({
    message: "Failed to delete task",
    error: error.message
  });
}
});

module.exports = router;