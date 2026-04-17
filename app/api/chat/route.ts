import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || "apikkkkkk"
})

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = Array.isArray(body?.messages) ? body.messages : []
    
    if (!messages.length) {
      return Response.json({ error: "No messages provided" }, { status: 400 })
    }

    const language = body?.language === "hi" ? "hi" : "en"
    
    const systemPrompt = language === 'hi' 
      ? "आप भारतीय कानून के विशेषज्ञ हैं। कृपया हिंदी में उत्तर दें और उपयोगकर्ता को उनके कानूनी अधिकारों के बारे में सही और सुरक्षित जानकारी दें।"
      : "You are an Indian law expert. Please answer in English and provide accurate and safe information regarding the user's legal rights."

    try {
      // Create a stream using the Vercel AI SDK
      const result = streamText({
        model: googleProvider('gemini-2.5-flash'),
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content
        })),
      })

      // Return a raw text stream response to bypass buggy frontend parsing
      return result.toTextStreamResponse()
    } catch (aiError) {
      console.error('AI SDK Error:', aiError)
      
      // Fallback for when the AI is not working properly
      const userMessage = messages[messages.length - 1].content.toLowerCase()
      let response = ""
      
      if (userMessage.includes('consumer') || userMessage.includes('उपभोक्ता')) {
        response = language === 'hi' 
          ? "उपभोक्ता संरक्षण अधिनियम 2019 के तहत आपके अधिकार:\n\n1. सुरक्षा का अधिकार\n2. सूचना का अधिकार\n3. चुनने का अधिकार\n4. सुनवाई का अधिकार\n5. निवारण का अधिकार\n6. उपभोक्ता शिक्षा का अधिकार\n\nशिकायत के लिए: राष्ट्रीय उपभोक्ता हेल्पलाइन 1915\n\n⚖️ कानूनी अस्वीकरण: यह केवल सामान्य जानकारी है।"
          : "Consumer Rights under Consumer Protection Act 2019:\n\n1. Right to Safety\n2. Right to Information\n3. Right to Choose\n4. Right to be Heard\n5. Right to Redressal\n6. Right to Consumer Education\n\nFor complaints: National Consumer Helpline 1915\n\n⚖️ Legal Disclaimer: This is general information only."
      } else if (userMessage.includes('right') || userMessage.includes('अधिकार')) {
        response = language === 'hi'
          ? "भारतीय संविधान के अनुच्छेद 14-32 में मौलिक अधिकार:\n\n1. समानता का अधिकार (अनुच्छेद 14-18)\n2. स्वतंत्रता का अधिकार (अनुच्छेद 19-22)\n3. शोषण के विरुद्ध अधिकार (अनुच्छेद 23-24)\n4. धर्म की स्वतंत्रता का अधिकार (अनुच्छेद 25-28)\n5. शिक्षा और संस्कृति का अधिकार (अनुच्छेद 29-30)\n6. संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)\n\n⚖️ कानूनी अस्वीकरण: यह केवल सामान्य जानकारी है।"
          : "Fundamental Rights under Indian Constitution (Articles 14-32):\n\n1. Right to Equality (Articles 14-18)\n2. Right to Freedom (Articles 19-22)\n3. Right against Exploitation (Articles 23-24)\n4. Right to Freedom of Religion (Articles 25-28)\n5. Cultural and Educational Rights (Articles 29-30)\n6. Right to Constitutional Remedies (Article 32)\n\n⚖️ Legal Disclaimer: This is general information only."
      } else {
        response = language === 'hi'
          ? `आपका प्रश्न: "${messages[messages.length - 1].content}"\n\nमैं भारतीय कानूनी जागरूकता सहायक हूं। मैं इन विषयों में मदद कर सकता हूं:\n\n• मौलिक अधिकार\n• उपभोक्ता संरक्षण\n• श्रम कानून\n• पारिवारिक कानून\n• RTI (सूचना का अधिकार)\n• महिला अधिकार\n\nकृपया स्पष्ट प्रश्न पूछें।\n\n⚖️ कानूनी अस्वीकरण: यह केवल सामान्य जानकारी है।`
          : `Your question: "${messages[messages.length - 1].content}"\n\nI'm your Legal Awareness Assistant for Indian law. I can help with:\n\n• Fundamental Rights\n• Consumer Protection\n• Labor Laws\n• Family Law\n• RTI (Right to Information)\n• Women's Rights\n\nPlease ask clearly.\n\n⚖️ Legal Disclaimer: This is general information only.`
      }
      
      return new Response(response, { headers: { "Content-Type": "text/plain" } })
    }

  } catch (error) {
    return Response.json({ 
      error: "Failed to process request", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}