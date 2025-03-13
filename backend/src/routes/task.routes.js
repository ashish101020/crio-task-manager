const express = require('express');
const Task = require('../models/task.models');
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = require("../middlewares/upload"); 


router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find().select("-linkedFile.data");
        return res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.post("/", upload.single("linkedFile"), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    let linkedFile = null;
    if (req.file) {
      linkedFile = {
        data: req.file.buffer, // Store file as binary buffer
        contentType: req.file.mimetype, // Store MIME type (e.g., 'application/pdf')
      };
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      linkedFile, // Store the file inside MongoDB
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating task" });
  }
});


router.get("/download/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !task.linkedFile || !task.linkedFile.data) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set({
      "Content-Type": task.linkedFile.contentType || "application/pdf", // Use stored MIME type
      "Content-Disposition": `attachment; filename="task-file.pdf"`,
    });

    res.send(task.linkedFile.data); // Send file buffer
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching file" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;

    // Fetch existing task to retain the original linkedFile
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    const updateData = { title, description, status, deadline, linkedFile: existingTask.linkedFile };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating task", error: error.message });
  }
});



// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description, status, deadline } = req.body;
    
//     // Fetch existing task to retain the original linkedFile
//     const existingTask = await Task.findById(req.params.id);
//     if (!existingTask) return res.status(404).json({ message: "Task not found" });

//     const updateData = { title, description, status, deadline };

//     // Preserve the existing file without updating it
//     updateData.linkedFile = existingTask.linkedFile;

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json(updatedTask);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Error updating task", error: error.message });
//   }
// });
 

// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description, status, deadline } = req.body;
//     const updateData = { title, description, status, deadline };

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) return res.status(404).json({ message: "Task not found" });

//     res.json(updatedTask);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Error updating task", error: error.message });
//   }
// });


router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted successfully', deletedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;