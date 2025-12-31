const Issue = require('../models/Issue');
const { uploadToCloudinary } = require('../utils/uploadUtils');
const { categorizeIssue } = require('../services/aiService');
const { sendEmail } = require('../services/mailService');
const { sendWhatsAppAlert } = require('../services/whatsappService');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (Citizen)
const createIssue = async (req, res) => {
    console.log(`[REQ] Create Issue - User: ${req.user._id} (${req.user.name})`);
    try {
        const { title, description, category, lat, lng, address } = req.body;

        // 1. Upload Media
        let imageUrl = '';
        let videoUrl = '';

        if (req.file) {
            console.log(`[UPLOAD] Starting upload for file: ${req.file.originalname}`);
            try {
                const result = await uploadToCloudinary(req.file.buffer);
                console.log(`[UPLOAD] Success: ${result.secure_url}`);
                if (result.resource_type === 'image') {
                    imageUrl = result.secure_url;
                } else if (result.resource_type === 'video') {
                    videoUrl = result.secure_url;
                }
            } catch (uploadErr) {
                console.error(`[UPLOAD] Failed: ${uploadErr.message}`);
            }
        }

        // 2. AI Categorization
        console.log('[AI] Categorizing issue...');
        const aiResult = await categorizeIssue(title, description);
        console.log(`[AI] Result: ${JSON.stringify(aiResult)}`);

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

        // Populate phone for WhatsApp
        const fullIssue = await Issue.findById(issue._id).populate('user', 'name email phone');
        console.log(`[DB] Issue Created: ${fullIssue._id}`);

        // 4. Real-time notification
        if (req.io) {
            req.io.emit('new-issue', fullIssue);
            console.log('[SOCKET] Emitted new-issue event');
        }

        // 5. Notifications
        let notificationStatus = { email: false, whatsapp: false, admin: false };

        try {
            console.log('[NOTIFY] Starting notifications...');

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
            const emailSent = await sendEmail(req.user.email, 'CivicPulse: Issue Report Confirmation', userHtml);
            notificationStatus.email = emailSent;

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
            const adminEmailSent = await sendEmail(process.env.ADMIN_EMAIL || 'admin@civicpulse.com', `[${aiResult.priority}] New Issue: ${title}`, adminHtml);
            notificationStatus.admin = adminEmailSent;

            // WhatsApp Notification to User (Confirmation)
            // Use req.user.phone if populated or from original user object in request if attached by middleware
            const userPhone = fullIssue.user.phone || req.user.phone;
            if (userPhone) {
                const userWaMessage = `✅ *CivicPulse Confirmation*\n\nYour issue has been successfully registered.\n\n*Issue:* ${title}\n*Tracking ID:* ${issue._id}\n\nThank you for being a responsible citizen.`;
                const userWaSent = await sendWhatsAppAlert(userWaMessage, userPhone);
                notificationStatus.whatsapp = userWaSent;
            } else {
                console.log('[NOTIFY] No phone number for user, skipping WhatsApp confirmation.');
            }

            // WhatsApp Alert (High/Critical) to Admin
            if (['HIGH', 'CRITICAL'].includes(aiResult.priority)) {
                const waMessage = `🚨 *CivicPulse Alert*\n\n*Issue:* ${title}\n*Category:* ${aiResult.category}\n*Priority:* ${aiResult.priority}\n*Location:* ${lat}, ${lng}\n*User:* ${req.user.name}`;
                await sendWhatsAppAlert(waMessage); // Defaults to Admin
            }

            console.log(`[NOTIFY] Finished. Status: ${JSON.stringify(notificationStatus)}`);

        } catch (notifyErr) {
            console.error('[NOTIFY] Error during notification process:', notifyErr);
        }

        res.status(201).json({ ...fullIssue.toObject(), notificationStatus });
    } catch (error) {
        console.error('[Create Issue Error]', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
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
