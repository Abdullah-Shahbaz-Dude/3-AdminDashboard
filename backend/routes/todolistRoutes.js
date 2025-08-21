const express = require("express");
const route = express.Router();
const ToDoSchema = require("../model/TodoList");

route.post("/api/submit", async (req, res) => {
  const { text } = req.body;

  try {
    const newTask = new ToDoSchema({ text });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500);
    res.json({ error: "Failed to save task" });
  }
});

route.get("/api/tasks", async (req, res) => {
  const tasks = await ToDoSchema.find();
  res.json(tasks);
});

module.exports = route;
