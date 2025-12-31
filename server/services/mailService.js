const nodemailer = require('nodemailer');

let transporter;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

/**
 * Send email using Nodemailer
 * @param {string} to 
 * @param {string} subject 
 * @param {string} html 
 */
const sendEmail = async (to, subject, html) => {
    if (!transporter) {
        console.log('================ [MOCK EMAIL] ================');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('-----------------------------------------------');
        // console.log(html); // Too verbose for console
        console.log('[Content Hidden - Mock Sent]');
        console.log('===============================================');
        return true;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"CivicPulse" <noreply@civicpulse.com>',
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Email Service Error:', error.message);
        return false;
    }
};

module.exports = { sendEmail };
