# Setup Guide - Legal Awareness Assistant

## Quick Start

The chat is now working in **demo mode**. You can test it immediately without any API keys.

## To Enable Full AI Features

1. **Get a Google AI API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy the key

2. **Configure the API Key:**
   - Open `.env.local` file in the project root
   - Replace `your_google_api_key_here` with your actual API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

## Current Status

✅ **Working Features:**
- Chat interface (demo mode)
- Language switching (Hindi/English)
- Speech recognition
- Text-to-speech
- User authentication
- Legal knowledge panel
- Responsive design

⚠️ **Demo Mode:**
- Chat responses are mock responses
- Shows your question and explains how to set up real AI
- All other features work normally

🚀 **With API Key:**
- Full Google Gemini 2.5 AI responses
- Context-aware legal guidance
- Streaming responses

## Troubleshooting

If chat still doesn't work:

1. **Check Console:** Open browser dev tools (F12) and check for errors
2. **Restart Server:** Stop (`Ctrl+C`) and restart (`npm run dev`)
3. **Clear Cache:** Hard refresh the browser (`Ctrl+Shift+R`)

## Testing

Try these sample questions:
- "What are my fundamental rights?"
- "मेरे मौलिक अधिकार क्या हैं?"
- "How to file an RTI application?"
- "Consumer protection laws in India"