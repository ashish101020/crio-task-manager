const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/api/tasks", taskRoutes);

mongoose.connect("mongodb://localhost:27017/task-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = 8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
