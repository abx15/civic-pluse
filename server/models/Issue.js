const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'Road', 'Water', 'Electricity', 'Garbage', 'Streetlight', 'Other'
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved'],
        default: 'pending'
    },
    aiCategory: {
        type: String
    },
    aiConfidence: {
        type: Number
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String } // Optional address string
    },
    image: {
        type: String, // URL from Cloudinary
    },
    video: {
        type: String, // URL from Cloudinary
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Authority
    },
    assignedAt: {
        type: Date
    },
    resolvedAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
    },
    escalated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
