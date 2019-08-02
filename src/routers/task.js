const express = require("express");
const Task = require("../models/task.js");
const router = express.Router();
const auth = require("../middleware/auth.js");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, creator: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Timestamps, pagination
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip)
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, creator: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updateProperties = req.body;
  const allowedUpdateProperties = ["description", "completed"];
  const isValidProperty = Object.keys(updateProperties).every(property =>
    allowedUpdateProperties.includes(property)
  );

  if (!isValidProperty) {
    return res.status(404).send("Invalid update property");
  }

  try {
    const task = await Task.findOne({ _id, creator: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    Object.keys(updateProperties).forEach(
      update => (task[update] = updateProperties[update])
    );

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete({ _id, creator: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
