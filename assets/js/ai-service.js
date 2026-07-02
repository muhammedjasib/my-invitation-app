// AI Service Module
// Integrates with OpenAI API for various AI features

const AIService = (() => {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const MODEL = 'gpt-3.5-turbo';

    // Get API key from environment or Firebase config
    const getAPIKey = async () => {
        // In production, this should come from a secure backend
        // For now, we'll use environment variable
        return process.env.VITE_OPENAI_API_KEY || localStorage.getItem('openaiApiKey');
    };

    const makeRequest = async (prompt, maxTokens = 500) => {
        try {
            const apiKey = await getAPIKey();
            if (!apiKey) throw new Error('OpenAI API key not configured');

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: maxTokens,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI Service error:', error);
            throw error;
        }
    };

    const generateWeddingQuote = async (brideName, groomName) => {
        const prompt = `Generate a beautiful, romantic, and unique wedding quote for a couple: ${brideName} and ${groomName}. Keep it under 100 words. Just provide the quote without any additional text.`;
        return await makeRequest(prompt, 150);
    };

    const generateLoveStory = async (brideName, groomName, briefStory = '') => {
        const prompt = `Generate a beautiful, romantic love story for ${brideName} and ${groomName}.${briefStory ? ` Their story: ${briefStory}` : ''} Keep it between 200-300 words, engaging and heartfelt.`;
        return await makeRequest(prompt, 400);
    };

    const generateInvitationDescription = async (brideName, groomName, venueName, weddingDate) => {
        const prompt = `Write a beautiful wedding invitation description for ${brideName} and ${groomName}'s wedding at ${venueName} on ${weddingDate}. Keep it elegant, warm, and under 150 words.`;
        return await makeRequest(prompt, 200);
    };

    const generateSEODescription = async (brideName, groomName, weddingDate) => {
        const prompt = `Create an SEO-optimized description for ${brideName} and ${groomName}'s digital wedding invitation (${weddingDate}). Use keywords like wedding, invitation, celebration, couple. Keep it under 160 characters for meta description.`;
        return await makeRequest(prompt, 150);
    };

    const generateColorPalette = async (style = 'elegant') => {
        const prompt = `Suggest a beautiful ${style} wedding color palette. Provide 5 colors with hex codes and brief names. Format as JSON array: [{"name": "...", "hex": "#...", "description": "..."}]. Just provide the JSON.`;
        try {
            const response = await makeRequest(prompt, 300);
            return JSON.parse(response);
        } catch (error) {
            console.error('Color palette generation error:', error);
            // Return default palette on error
            return [
                { name: 'Gold', hex: '#D4A574', description: 'Warm and luxurious' },
                { name: 'Cream', hex: '#F5F5DC', description: 'Elegant and soft' },
                { name: 'Blush', hex: '#FFB6C1', description: 'Romantic and gentle' },
                { name: 'Navy', hex: '#1A1A3E', description: 'Deep and sophisticated' },
                { name: 'Rose', hex: '#C0527F', description: 'Rich and beautiful' }
            ];
        }
    };

    const generateEventSchedule = async (weddingDate, ceremonyTime, receptionTime) => {
        const prompt = `Generate a detailed wedding event schedule for a wedding on ${weddingDate}, with ceremony at ${ceremonyTime} and reception at ${receptionTime}. Include typical events like arrival, ceremony, cocktail hour, dinner, etc. Format as timeline with times and descriptions.`;
        return await makeRequest(prompt, 400);
    };

    const generateWelcomeMessage = async (brideName, groomName, guestName = null) => {
        let prompt = `Write a warm and welcoming message from ${brideName} and ${groomName} to welcome guests to their wedding invitation`;
        if (guestName) {
            prompt += ` for ${guestName}`;
        }
        prompt += '. Keep it personal, warm, and under 100 words.';
        return await makeRequest(prompt, 150);
    };

    const generateThemeSuggestions = async (brideName, groomName, preferredStyle = '') => {
        let prompt = `Suggest 5 wedding themes for ${brideName} and ${groomName}`;
        if (preferredStyle) {
            prompt += ` with a ${preferredStyle} style`;
        }
        prompt += `. For each theme, provide name, description, and suggested colors. Format as JSON array.`;
        try {
            const response = await makeRequest(prompt, 500);
            return JSON.parse(response);
        } catch (error) {
            console.error('Theme suggestions error:', error);
            return [];
        }
    };

    return {
        generateWeddingQuote,
        generateLoveStory,
        generateInvitationDescription,
        generateSEODescription,
        generateColorPalette,
        generateEventSchedule,
        generateWelcomeMessage,
        generateThemeSuggestions
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
}
