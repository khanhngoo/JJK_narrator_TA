import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { JJK_NARRATOR_PROMPT } from '@/lib/ai/prompts'

export const maxDuration = 30 // Set max duration for Vercel functions

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response(
        JSON.stringify({ error: 'User message required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = streamText({
      model: openai('gpt-4o-mini') as any, // Type assertion for model compatibility
      system: JJK_NARRATOR_PROMPT,
      messages: [
        {
          role: 'user',
          content: lastMessage.content
        }
      ],
      temperature: 0.7,
    })

    // Return streaming response per Vercel AI SDK pattern
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate explanation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}