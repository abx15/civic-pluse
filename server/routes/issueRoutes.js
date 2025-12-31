const express = require('express');
const router = express.Router();
const { createIssue, getIssues, updateIssueStatus } = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('media'), createIssue);
router.get('/', protect, getIssues);
router.put('/:id/status', protect, authorize('authority', 'admin'), updateIssueStatus);

module.exports = router;
