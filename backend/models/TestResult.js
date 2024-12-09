import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  cpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const TestResult = mongoose.model("TestResult", TestResultSchema);
