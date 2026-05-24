const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, getResumeById, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/all', protect, getResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);

module.exports = router;
