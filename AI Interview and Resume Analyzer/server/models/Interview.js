const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  questionText: { type: String, required: true },
  category: { type: String, default: 'technical' }
});

const AnswerSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  userAnswerText: { type: String, required: true }
});

const FeedbackSchema = new mongoose.Schema({
  technicalScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  problemSolvingScore: { type: Number, default: 0 },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  improvementSuggestions: { type: [String], default: [] }
});

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobType: {
    type: String,
    required: true
  },
  questions: [QuestionSchema],
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  feedback: FeedbackSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
