import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Write a vegetarian recipe.',
    });
    console.log(text);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
