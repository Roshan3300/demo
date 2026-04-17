const apiKey = 'API';

async function testKey() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.5-flash', 'gemini-pro', 'gemini-1.5-pro'];
  for (const model of models) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    console.log(`${model}: ${response.status}`);
  }
}

testKey();
