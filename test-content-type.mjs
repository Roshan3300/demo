import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleProvider = createGoogleGenerativeAI({
  apiKey: "API"
});

async function main() {
  const result = streamText({
    model: googleProvider('gemini-2.5-flash'),
    prompt: 'Hello',
  });
  
  const response = result.toTextStreamResponse();
  console.log("Content-Type:", response.headers.get('content-type'));
}

main();
