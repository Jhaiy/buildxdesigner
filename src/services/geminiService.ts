export async function generateCodeWithGemini(prompt: string, apiKey: string): Promise<string> {
  const systemPrompt = `You are an expert React developer. Generate clean, production-ready React JSX code based on the user's request.

IMPORTANT RULES:
1. Return ONLY the React component code wrapped in \`\`\`tsx code blocks
2. The component should be a functional React component
3. Use Tailwind CSS for styling
4. Import necessary hooks and components at the top
5. Make the component responsive and modern
6. No placeholder text - use real, contextual content
7. Use shadcn/ui components when applicable (Button, Card, Input, etc.)
8. Make the code production-ready and properly typed

Return the code in this format:
\`\`\`tsx
import React from 'react';
// ... your component code
export default function Component() {
  // ...
}
\`\`\``

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Request: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Extract code from markdown blocks
    const codeMatch = generatedText.match(/```tsx\n([\s\S]*?)\n```/)
    if (codeMatch) {
      return codeMatch[1]
    }

    return generatedText
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}

export async function generateUIComponentsWithGemini(prompt: string, apiKey: string): Promise<any[]> {
  const systemPrompt = `You are a UI/UX designer. Generate a structured component layout based on the description.

Return a JSON array with this exact structure:
[
  {
    "type": "component_name",
    "props": { /* component props */ },
    "children": "string content"
  }
]

Available components: navbar, hero, heading, text, button, container, grid, card, form, input, textarea, image, footer, gallery`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nDescription: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Extract JSON from response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return []
  } catch (error) {
    console.error("Gemini generation error:", error)
    return []
  }
}
