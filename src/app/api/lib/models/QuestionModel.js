const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  questionText: { type: String, required: true }, // encrypted AES
  options: [{ type: String, required: true }], // encrypted AES
  correctAnswer: { type: String, required: true }, // encrypted AES
  explanation: { type: String }, // optional, encrypted AES
  questionNumber: { type: Number }, // Maybe to be removed since the q's will be random
  createdAt: { type: Date, default: Date.now },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
module.exports = { Question };
