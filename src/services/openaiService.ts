import type { ComponentData } from "@/types"
import { getOpenAIKey } from "@/config/apiKeys"

interface GenerationResponse {
  components: ComponentData[]
  code: string
}

export async function generateUIAndCodeWithOpenAI(
  prompt: string,
  apiKey?: string,
  onProgressUpdate?: (progress: number) => void,
): Promise<GenerationResponse> {
  const keyToUse = apiKey || getOpenAIKey()

  try {
    onProgressUpdate?.(20)

    // Generate components/design
    const componentsResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional web designer and React developer. Generate complete website structures based on descriptions.",
          },
          {
            role: "user",
            content: `Generate a complete website structure based on this description: "${prompt}".

Return ONLY a valid JSON array of component objects. Each component should have this exact structure:
{
    "id": "unique-id-${Date.now()}",
    "type": "one of: navbar, hero, features, cta, footer, text, button, image, card, grid",
    "props": {
        "text": "component text content",
        "heading": "heading text if applicable",
        "subheading": "subheading if applicable",
        "buttonText": "button text if applicable",
        "imageUrl": "https://images.unsplash.com/...",
        "items": [],
        "backgroundColor": "hex color",
        "textColor": "hex color"
    },
    "style": {
        "backgroundColor": "hex color",
        "color": "hex color",
        "padding": "value in px",
        "textAlign": "left/center/right",
        "borderRadius": "value in px"
    }
}

Generate 5-8 components that form a complete, modern website. Use professional colors and modern layouts. Return ONLY the JSON array, no markdown, no explanation.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    })

    if (!componentsResponse.ok) {
      const errorData = await componentsResponse.json()
      console.error("[v0] OpenAI API error:", errorData)
      throw new Error(`OpenAI API Error: ${errorData.error?.message || "Failed to generate UI"}`)
    }

    onProgressUpdate?.(50)

    const componentsData = await componentsResponse.json()
    let components: ComponentData[] = []

    try {
      const generatedText = componentsData.choices[0]?.message?.content || ""
      const cleanedText = generatedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      components = JSON.parse(cleanedText)
      console.log("[v0] Generated components:", components)
    } catch (parseError) {
      console.error("[v0] Failed to parse components:", parseError)
      components = []
    }

    onProgressUpdate?.(70)

    // Generate code
    const codeResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert React developer. Generate production-ready TSX code based on component specifications.",
          },
          {
            role: "user",
            content: `Generate production-ready React TSX code for this component structure: ${JSON.stringify(components, null, 2)}

The code should:
1. Use React with TypeScript (TSX)
2. Import necessary UI components from @/components/ui/*
3. Use Tailwind CSS for styling with professional colors
4. Be a complete, runnable component
5. Handle responsive design with mobile-first approach
6. Include proper TypeScript types
7. Use semantic HTML

Return ONLY the TSX code, no markdown, no explanation.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!codeResponse.ok) {
      const errorData = await codeResponse.json()
      console.error("[v0] OpenAI code generation error:", errorData)
      throw new Error(`OpenAI API Error: ${errorData.error?.message || "Failed to generate code"}`)
    }

    onProgressUpdate?.(90)

    const codeData = await codeResponse.json()
    let code = ""

    try {
      const generatedCode = codeData.choices[0]?.message?.content || ""
      code = generatedCode
        .replace(/```tsx\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      console.log("[v0] Generated code length:", code.length)
    } catch (parseError) {
      console.error("[v0] Failed to parse code:", parseError)
      code = ""
    }

    onProgressUpdate?.(100)

    return { components, code }
  } catch (error) {
    console.error("[v0] Generation error:", error)
    throw error
  }
}

export async function generateAIResponse(userMessage: string, apiKey?: string): Promise<string> {
  const keyToUse = apiKey || getOpenAIKey()

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful web development assistant. Provide concise, practical advice about web design, CSS, JavaScript, React, and web development best practices.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI response error:", errorData)
      throw new Error(`OpenAI API Error: ${errorData.error?.message || "Failed to generate response"}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
  } catch (error) {
    console.error("[v0] AI response error:", error)
    throw error
  }
}
