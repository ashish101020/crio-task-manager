const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["TODO", "DONE"], default: "TODO" },
    linkedFile: {
      data: Buffer, // Store binary file
      contentType: String, // Store MIME type (important for retrieval)
    },
    createdOn: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
