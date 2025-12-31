const OpenAI = require('openai');

// Initialize OpenAI only if key exists
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

/**
 * Categorize issue based on title and description
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<{category: string, priority: string, confidence: number}>}
 */
const categorizeIssue = async (title, description) => {
    // Return mock data if no API key
    if (!openai) {
        console.log('[Mock AI] Categorizing issue:', title);
        return mockCategorize(title, description);
    }

    try {
        const prompt = `
        Analyze the following civic issue report and categorize it.
        Title: ${title}
        Description: ${description}

        Categories: Road, Water, Electricity, Crime, Medical, Fire, Garbage, Streetlight, Other.
        Priorities: LOW, MEDIUM, HIGH, CRITICAL.

        Return JSON format: { "category": "...", "priority": "...", "confidence": 0.0-1.0 }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result;

    } catch (error) {
        console.error('AI Service Error:', error.message);
        return mockCategorize(title, description);
    }
};

const mockCategorize = (title, description) => {
    const text = (title + ' ' + description).toLowerCase();

    let category = 'Other';
    let priority = 'MEDIUM';

    if (text.includes('fire') || text.includes('accident') || text.includes('blood') || text.includes('collapse')) {
        category = text.includes('fire') ? 'Fire' : 'Medical';
        priority = 'CRITICAL';
    } else if (text.includes('water') || text.includes('leak') || text.includes('pipe')) {
        category = 'Water';
        priority = 'HIGH';
    } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic')) {
        category = 'Road';
        priority = 'MEDIUM';
    } else if (text.includes('electricity') || text.includes('power') || text.includes('pole')) {
        category = 'Electricity';
        priority = 'HIGH';
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste')) {
        category = 'Garbage';
        priority = 'LOW';
    }

    return {
        category,
        priority,
        confidence: 0.85
    };
};

module.exports = { categorizeIssue };
