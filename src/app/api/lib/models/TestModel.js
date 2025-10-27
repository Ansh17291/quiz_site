const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  testName: { type: String },
  // teacher: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  // Uncomment me once done
  questionRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalQuestions: { type: Number, default: 0 },
  encrypted: { type: Boolean, default: true }, // AES encrypted
  totalTime: { type: Number }, // in minutes
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

module.exports = { Test };
