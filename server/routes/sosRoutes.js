const express = require('express');
const router = express.Router();
const { createSOS, getSOSAlerts, resolveSOS } = require('../controllers/sosController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createSOS);
router.get('/', protect, getSOSAlerts); // Any auth user can see for now, or just authorities
router.put('/:id/resolve', protect, authorize('authority', 'admin', 'police', 'medical', 'fire'), resolveSOS);
router.put('/:id/assign', protect, authorize('authority', 'admin', 'police', 'medical', 'fire'), require('../controllers/sosController').assignSOS);

module.exports = router;
