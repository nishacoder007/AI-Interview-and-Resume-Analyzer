const Interview = require('../models/Interview');
const localDb = require('../utils/localDb');
const openaiService = require('../services/openaiService');

// @desc    Start Interview - Generate Questions
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  const { jobType } = req.body;

  if (!jobType) {
    return res.status(400).json({ message: 'Please specify a job type' });
  }

  try {
    console.log(`🤖 Requesting AI question generation for role: "${jobType}"...`);
    const questions = await openaiService.generateInterviewQuestions(jobType);
    
    res.json({
      jobType,
      questions
    });
  } catch (error) {
    console.error('Start interview error:', error.message);
    res.status(500).json({ message: 'Error generating interview questions', error: error.message });
  }
};

// @desc    Submit Answers - Grade & Save Interview
// @route   POST /api/interview/answer
// @access  Private
const submitAnswers = async (req, res) => {
  const { jobType, questions, answers } = req.body;

  if (!jobType || !questions || !answers || !Array.isArray(questions) || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Please provide jobType, questions array, and answers array' });
  }

  try {
    console.log(`🤖 Submitting responses for "${jobType}". AI grading in progress...`);
    const evaluation = await openaiService.evaluateInterview(jobType, questions, answers);

    const interviewData = {
      userId: req.user.id,
      jobType,
      questions,
      answers,
      score: evaluation.score || 70,
      feedback: {
        technicalScore: evaluation.feedback?.technicalScore || 70,
        communicationScore: evaluation.feedback?.communicationScore || 70,
        confidenceScore: evaluation.feedback?.confidenceScore || 70,
        problemSolvingScore: evaluation.feedback?.problemSolvingScore || 70,
        strengths: evaluation.feedback?.strengths || [],
        weaknesses: evaluation.feedback?.weaknesses || [],
        improvementSuggestions: evaluation.feedback?.improvementSuggestions || []
      }
    };

    // Save record to DB
    let newInterview;
    if (global.useLocalDB) {
      newInterview = localDb.interviews.create(interviewData);
    } else {
      newInterview = await Interview.create(interviewData);
    }

    console.log('✅ AI Grading complete. Saved Interview ID:', newInterview._id || newInterview.id);
    res.status(201).json(newInterview);
  } catch (error) {
    console.error('Submit answers evaluation error:', error.message);
    res.status(500).json({ message: 'Error grading and saving interview', error: error.message });
  }
};

// @desc    Get Interview Result details by ID
// @route   GET /api/interview/result/:id
// @access  Private
const getInterviewResult = async (req, res) => {
  const { id } = req.params;

  try {
    let interview;
    if (global.useLocalDB) {
      interview = localDb.interviews.findById(id);
    } else {
      interview = await Interview.findById(id);
    }

    if (!interview) {
      return res.status(404).json({ message: 'Interview result record not found' });
    }

    // Security check: Only owner can view
    const ownerId = interview.userId.toString();
    if (ownerId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this interview analysis' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Fetch interview ID error:', error.message);
    res.status(500).json({ message: 'Server error retrieving interview result details', error: error.message });
  }
};

// @desc    Get All Interview History of logged-in user
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    let history;
    if (global.useLocalDB) {
      history = localDb.interviews.find({ userId: req.user.id });
    } else {
      history = await Interview.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(history);
  } catch (error) {
    console.error('Fetch interview history error:', error.message);
    res.status(500).json({ message: 'Server error retrieving interview history', error: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswers,
  getInterviewResult,
  getInterviewHistory
};
