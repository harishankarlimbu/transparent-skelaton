import { GoogleGenerativeAI } from '@google/generative-ai';
import { scriptFormatterPrompt, scriptFormatterConfig } from '../prompts/formatmasterprompt.js';

export const geminiService = {
  formatScript: async (script: string): Promise<string> => {
    console.log('🔍 Checking Gemini API Key:', process.env.GEMINI_API_KEY ? 'Present ✅' : 'Missing ❌');
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in .env file');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Define JSON schema for structured output
    // Create properties for scene_1 through scene_30
    const properties: Record<string, { type: 'string' }> = {};
    const required: string[] = [];
    for (let i = 1; i <= 30; i++) {
      properties[`scene_${i}`] = { type: 'string' as const };
      // Make first 25 scenes REQUIRED to force the model to generate at least 25
      if (i <= 25) {
        required.push(`scene_${i}`);
      }
    }
    
    // Gemini API schema format - require at least 25 scenes
    const responseSchema = {
      type: 'object' as const,
      properties: properties,
      required: required, // Force at least 25 scenes
    };
    
    const model = genAI.getGenerativeModel({ 
      model: scriptFormatterConfig.model,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any, // Type assertion needed for dynamic schema
        maxOutputTokens: 8192, // Ensure enough tokens for 25-30 scenes
      }
    });

    let basePrompt = scriptFormatterPrompt(script);
    console.log('📤 Sending request to Gemini API...');
    
    // Retry up to 3 times if we don't get enough scenes
    let attempts = 0;
    const maxAttempts = 3;
    let currentPrompt = basePrompt;
    
    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(currentPrompt);
        const response = result.response;
        const text = response.text();
        console.log('✅ Successfully received response from Gemini');
        console.log('📄 Response preview:', text.substring(0, 200));
        
        // Validate that response is JSON
        try {
          const parsed = JSON.parse(text);
          const sceneCount = Object.keys(parsed).length;
          console.log('✅ Response is valid JSON with', sceneCount, 'scenes');
          
          // If we got fewer than 25 scenes, retry with a more aggressive prompt
          if (sceneCount < 25) {
            attempts++;
            if (attempts < maxAttempts) {
              console.warn(`⚠️ WARNING: Only ${sceneCount} scenes generated. Retrying (attempt ${attempts + 1}/${maxAttempts})...`);
              console.warn('   Adding more explicit instructions to generate 25+ scenes.');
              // Add a more aggressive instruction to the prompt
              currentPrompt = basePrompt + `\n\n🚨 CRITICAL RETRY INSTRUCTION: You only generated ${sceneCount} scenes in your previous attempt. This is INCORRECT. You MUST generate at least 25 scenes (scene_1 through scene_25 are REQUIRED by the schema). Break down the script into MUCH smaller, more granular visual moments. Split every sentence, every phrase, every visual detail, every action, every emotion into separate scenes. Think of camera movements, transitions, close-ups, wide shots - each is a scene. You MUST reach at least 25 scenes.`;
            } else {
              console.error(`❌ ERROR: After ${maxAttempts} attempts, only ${sceneCount} scenes were generated. Expected 25-30 scenes.`);
              console.error('   Returning the result anyway, but it does not meet the requirement.');
              return text.trim();
            }
          } else if (sceneCount > 30) {
            console.warn(`⚠️ WARNING: ${sceneCount} scenes generated. Expected maximum 30 scenes.`);
            return text.trim();
          } else {
            // Success! We got 25-30 scenes
            return text.trim();
          }
        } catch (parseError) {
          console.error('❌ Response is NOT valid JSON!');
          console.error('Raw response:', text);
          throw new Error('Gemini API did not return valid JSON. Response: ' + text.substring(0, 200));
        }
      } catch (error: any) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error('❌ Gemini API Error Details:');
          console.error('   Message:', error.message);
          console.error('   Status:', error.status || 'N/A');
          if (error.response) {
            console.error('   Response:', JSON.stringify(error.response, null, 2));
          }
          throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
        }
        console.warn(`⚠️ Error on attempt ${attempts}, retrying...`);
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('Failed to generate scenes after multiple attempts');
  },
};
