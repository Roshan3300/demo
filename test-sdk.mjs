import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

// Use the key explicitly for testing
process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'API';

async function main() {
  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Say hello in one word.',
    });
    console.log("SUCCESS:", text);
  } catch (err) {
    console.error('ERROR:', err.message || err);
  }
}

main();
