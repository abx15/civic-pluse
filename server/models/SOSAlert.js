const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['accident', 'fire', 'medical', 'crime', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'false_alarm'],
        default: 'active'
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Authority/Responder
    },
    assignedAt: {
        type: Date
    },
    resolvedAt: {
        type: Date
    },
    priority: {
        type: String,
        default: 'CRITICAL' // SOS is always Critical/High
    }
}, {
    timestamps: true
});

const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);

module.exports = SOSAlert;
