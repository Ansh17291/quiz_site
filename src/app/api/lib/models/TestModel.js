const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  testName: { type: String },
  subject: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  testDate: { type: Date, required: true },
  totalQuestions: { type: Number, default: 0 },
  encrypted: { type: Boolean, default: true }, // AES encrypted
  createdAt: { type: Date, default: Date.now },
  expirationDate: { type: Date, required: true },
  totalTime: { type: Number },
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);
module.exports = { Test };
