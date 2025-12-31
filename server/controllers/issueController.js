const Issue = require('../models/Issue');
const { uploadToCloudinary } = require('../utils/uploadUtils');
const { categorizeIssue } = require('../services/aiService');
const { sendEmail } = require('../services/mailService');
const { sendWhatsAppAlert } = require('../services/whatsappService');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (Citizen)
const createIssue = async (req, res) => {
    try {
        const { title, description, category, lat, lng, address } = req.body;

        // 1. Upload Media
        let imageUrl = '';
        let videoUrl = '';

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            if (result.resource_type === 'image') {
                imageUrl = result.secure_url;
            } else if (result.resource_type === 'video') {
                videoUrl = result.secure_url;
            }
        }

        // 2. AI Categorization
        const aiResult = await categorizeIssue(title, description);

        // 3. Create Issue
        const issue = await Issue.create({
            user: req.user._id,
            title,
            description,
            category, // User selected value
            aiCategory: aiResult.category,
            priority: aiResult.priority, // AI Assigned Priority
            aiConfidence: aiResult.confidence,
            location: {
                lat,
                lng,
                address
            },
            image: imageUrl,
            video: videoUrl
        });

        const fullIssue = await Issue.findById(issue._id).populate('user', 'name email');

        // 4. Real-time notification
        req.io.emit('new-issue', fullIssue);

        // 5. Notifications (Async - don't block response)
        const sendNotifications = async () => {
            // User Confirmation Email
            const userHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2563eb;">Issue Reported Successfully</h2>
                    <p>Dear ${req.user.name},</p>
                    <p>Thank you for reporting the issue: <strong>${title}</strong>.</p>
                    <p>Our team has been notified and the issue has been categorized as <strong>${aiResult.priority}</strong> priority.</p>
                    <p>Reference ID: ${issue._id}</p>
                    <br>
                    <p>Best Regards,<br>CivicPulse Team</p>
                </div>
            `;
            await sendEmail(req.user.email, 'CivicPulse: Issue Report Confirmation', userHtml);

            // Admin Alert Email
            const adminHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #dc2626;">🚨 New Issue Reported</h2>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Category:</strong> ${category} (AI: ${aiResult.category})</p>
                    <p><strong>Priority:</strong> ${aiResult.priority}</p>
                    <p><strong>Location:</strong> ${address} (${lat}, ${lng})</p>
                    <p><strong>Reported By:</strong> ${req.user.name}</p>
                    <br>
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/issues/${issue._id}">View Dashboard</a>
                </div>
            `;
            await sendEmail(process.env.ADMIN_EMAIL || 'admin@civicpulse.com', `[${aiResult.priority}] New Issue: ${title}`, adminHtml);

            // WhatsApp Notification to User (Confirmation)
            if (req.user.phone) {
                const userWaMessage = `✅ *CivicPulse Confirmation*\n\nYour issue has been successfully registered.\n\n*Issue:* ${title}\n*Tracking ID:* ${issue._id}\n\nThank you for being a responsible citizen.`;
                await sendWhatsAppAlert(userWaMessage, req.user.phone);
            }

            // WhatsApp Alert (High/Critical) to Admin
            if (['HIGH', 'CRITICAL'].includes(aiResult.priority)) {
                const waMessage = `🚨 *CivicPulse Alert*\n\n*Issue:* ${title}\n*Category:* ${aiResult.category}\n*Priority:* ${aiResult.priority}\n*Location:* ${lat}, ${lng}\n*User:* ${req.user.name}`;
                await sendWhatsAppAlert(waMessage); // Defaults to Admin
            }
        };

        sendNotifications().catch(err => console.error('Notification Error:', err));

        res.status(201).json(fullIssue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (Authority)
const updateIssueStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.status = status;
        if (req.user.role !== 'citizen') {
            issue.assignedTo = req.user._id;
        }

        await issue.save();

        // Notify citizen
        req.io.emit('issue-updated', issue);

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createIssue, getIssues, updateIssueStatus };
