const Issue = require('../models/Issue');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private (Admin/Super Admin)
const getAnalytics = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
        const totalSOS = await SOSAlert.countDocuments();
        const activeSOS = await SOSAlert.countDocuments({ status: 'active' });

        const issuesByDepartment = await Issue.aggregate([
            { $match: { category: { $ne: null } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Simple Average Resolution Time Calculation (in hours)
        const resolutionStats = await Issue.aggregate([
            { $match: { status: 'resolved', resolvedAt: { $exists: true }, createdAt: { $exists: true } } },
            {
                $project: {
                    duration: { $subtract: ["$resolvedAt", "$createdAt"] }
                }
            },
            {
                $group: {
                    _id: null,
                    avgResolutionTime: { $avg: "$duration" }
                }
            }
        ]);

        const preciseResolutionTimeHours = resolutionStats.length > 0
            ? (resolutionStats[0].avgResolutionTime / (1000 * 60 * 60)).toFixed(2)
            : 0;

        res.json({
            totalIssues,
            resolvedIssues,
            totalSOS,
            activeSOS,
            issuesByDepartment,
            avgResolutionTimeHours: preciseResolutionTimeHours
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAnalytics };
