const SOSAlert = require('../models/SOSAlert');

// @desc    Create SOS Alert
// @route   POST /api/sos
// @access  Private (Citizen)
const createSOS = async (req, res) => {
    try {
        console.log("Creating SOS", req.body);
        const { type, lat, lng, address } = req.body;

        const sos = await SOSAlert.create({
            user: req.user._id,
            type,
            location: {
                lat,
                lng,
                address
            }
        });

        const fullSOS = await SOSAlert.findById(sos._id).populate('user', 'name phone');

        // Broadcast High Priority Alert
        req.io.emit('sos-alert', fullSOS);

        res.status(201).json(fullSOS);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get active SOS Alerts
// @route   GET /api/sos
// @access  Private (Authority)
const getSOSAlerts = async (req, res) => {
    try {
        const alerts = await SOSAlert.find({ status: 'active' }).populate('user', 'name phone').sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resolve SOS Alert
// @route   PUT /api/sos/:id/resolve
// @access  Private (Authority)
const resolveSOS = async (req, res) => {
    try {
        const sos = await SOSAlert.findById(req.params.id);

        if (!sos) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        sos.status = 'resolved';
        sos.resolvedAt = Date.now();

        if (!sos.assignedTo) {
            sos.assignedTo = req.user._id;
            sos.assignedAt = Date.now();
        }

        await sos.save();

        const updatedSOS = await SOSAlert.findById(sos._id).populate('user', 'name phone').populate('assignedTo', 'name');

        req.io.emit('sos-resolved', updatedSOS);

        res.json(updatedSOS);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Assign SOS Alert
// @route   PUT /api/sos/:id/assign
// @access  Private (Authority)
const assignSOS = async (req, res) => {
    try {
        const sos = await SOSAlert.findById(req.params.id);
        if (!sos) return res.status(404).json({ message: 'Alert not found' });

        sos.assignedTo = req.user._id;
        sos.assignedAt = Date.now();
        await sos.save();

        const updatedSOS = await SOSAlert.findById(sos._id).populate('user', 'name phone').populate('assignedTo', 'name');

        req.io.emit('authority-accepted', updatedSOS);

        res.json(updatedSOS);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createSOS, getSOSAlerts, resolveSOS, assignSOS };


