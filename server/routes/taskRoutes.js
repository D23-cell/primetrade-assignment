const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  res.status(200).json(tasks);
});

router.post('/', protect, async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: 'Please add a text field' });
  }

  const task = await Task.create({
    title: req.body.title,
    user: req.user,
  });

  res.status(200).json(task);
});

router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(400).json({ message: 'Task not found' });
  }

  if (task.user.toString() !== req.user) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
});

router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(400).json({ message: 'Task not found' });
  }

  if (task.user.toString() !== req.user) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = router;