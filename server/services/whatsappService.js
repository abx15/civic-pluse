const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Send WhatsApp alert
 * @param {string} message 
 * @param {string} [to] - Optional recipient ('whatsapp:+123...')
 */
const sendWhatsAppAlert = async (message, to) => {
    // Default to Admin if no recipient specified
    const recipient = to ? `whatsapp:${to}` : (process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+1234567890');

    if (!client) {
        console.log('================ [MOCK WHATSAPP] ================');
        console.log(`To: ${recipient}`);
        console.log(`Message: ${message}`);
        console.log('=================================================');
        return true;
    }

    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: recipient
        });
        console.log(`WhatsApp sent to ${recipient}`);
        return true;
    } catch (error) {
        console.error('WhatsApp Service Error:', error.message);
        return false;
    }
};

module.exports = { sendWhatsAppAlert };
