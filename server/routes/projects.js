const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ title: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a project
router.post('/', auth, async (req, res) => {
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    image: req.body.image,
    user: req.user.id
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.body.title) project.title = req.body.title;
    if (req.body.description) project.description = req.body.description;
    if (req.body.link) project.link = req.body.link;
    if (req.body.image) project.image = req.body.image;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
