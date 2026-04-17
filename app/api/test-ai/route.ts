import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function GET() {
  try {
    const googleApiKey = process.env.GOOGLE_API_KEY
    
    if (!googleApiKey) {
      return Response.json({ error: "No API key found" })
    }

    const result = await generateText({
      model: google("gemini-1.5-pro", { apiKey: googleApiKey }),
      prompt: "Say hello in one sentence",
      maxTokens: 50,
    })

    return Response.json({ 
      success: true, 
      text: result.text,
      apiKeyPresent: !!googleApiKey 
    })
  } catch (error) {
    return Response.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      apiKeyPresent: !!process.env.GOOGLE_API_KEY 
    })
  }
}