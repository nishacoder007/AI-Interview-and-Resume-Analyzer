const express = require('express');
const router = express.Router();
const { startInterview, submitAnswers, getInterviewResult, getInterviewHistory } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswers);
router.get('/result/:id', protect, getInterviewResult);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
