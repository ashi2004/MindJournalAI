const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// console.log(
//   "Hugging Face Token:",
//   process.env.HUGGINGFACE_API_TOKEN ? "Loaded" : "Missing"
// );
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const journalRoutes = require("./routes/journal");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("MindJournal AI backend is running");
});

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/journal", journalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
