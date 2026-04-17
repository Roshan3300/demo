import { POST } from './app/api/chat/route.ts';

async function testApi() {
  const req = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What are my consumer rights?' }],
      language: 'en'
    })
  });
  
  const response = await POST(req);
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers));
  
  const text = await response.text();
  console.log('Response:', text);
}

testApi();
