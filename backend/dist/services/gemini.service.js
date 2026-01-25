import { GoogleGenerativeAI } from '@google/generative-ai';
import { scriptFormatterPrompt, scriptFormatterConfig } from '../prompts/formatmasterprompt.js';
export const geminiService = {
    formatScript: async (script) => {
        console.log('🔍 Checking Gemini API Key:', process.env.GEMINI_API_KEY ? 'Present ✅' : 'Missing ❌');
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in .env file');
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Define JSON schema for structured output
        // Create properties for scene_1 through scene_30
        const properties = {};
        for (let i = 1; i <= 30; i++) {
            properties[`scene_${i}`] = { type: 'string' };
        }
        const responseSchema = {
            type: 'object',
            properties: properties,
            additionalProperties: false,
        };
        const model = genAI.getGenerativeModel({
            model: scriptFormatterConfig.model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema, // Type assertion needed for dynamic schema
            }
        });
        const prompt = scriptFormatterPrompt(script);
        console.log('📤 Sending request to Gemini API...');
        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log('✅ Successfully received response from Gemini');
            console.log('📄 Response preview:', text.substring(0, 200));
            // Validate that response is JSON
            try {
                const parsed = JSON.parse(text);
                console.log('✅ Response is valid JSON with', Object.keys(parsed).length, 'scenes');
                return text.trim();
            }
            catch (parseError) {
                console.error('❌ Response is NOT valid JSON!');
                console.error('Raw response:', text);
                throw new Error('Gemini API did not return valid JSON. Response: ' + text.substring(0, 200));
            }
        }
        catch (error) {
            console.error('❌ Gemini API Error Details:');
            console.error('   Message:', error.message);
            console.error('   Status:', error.status || 'N/A');
            if (error.response) {
                console.error('   Response:', JSON.stringify(error.response, null, 2));
            }
            throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
        }
    },
};
//# sourceMappingURL=gemini.service.js.map