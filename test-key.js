const apiKey = 'API';

async function testKey() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Hello, world!" }]
      }]
    })
  });
  
  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}

testKey();
