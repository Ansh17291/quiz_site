const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  WrongQ: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  percentage: { type: Number, required: true },
  encrypted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
module.exports = { Result };
