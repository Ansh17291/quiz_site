const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  assignedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }], // for students
  createdAt: { type: Date, default: Date.now },
});

module.exports = { User: mongoose.model("User", userSchema) };
