// OpenRouter client for LLM
// Direct fetch to OpenRouter API - free tier available

import { JJK_NARRATOR_PROMPT } from '@/lib/ai/prompts'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response(
        JSON.stringify({ error: 'User message required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build messages with system prompt
    const chatMessages = [
      { role: 'system', content: JJK_NARRATOR_PROMPT },
      { role: 'user', content: lastMessage.content }
    ]

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/khanhngoo/JJK_narrator_TA',
        'X-Title': 'JJK Narrator AI Teacher',
      },
      body: JSON.stringify({
        model: 'arcee-ai/trinity-large-preview', // Free model, good for creative writing
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate explanation' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate explanation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
