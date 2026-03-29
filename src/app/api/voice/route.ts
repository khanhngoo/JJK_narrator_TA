import { NextRequest, NextResponse } from 'next/server'
import { getElevenLabsClient } from '@/lib/voice/elevenlabs'
import { getNarratorVoiceId, getNarratorModel } from '@/lib/voice/voice-config'
import { getCachedAudio, setCachedAudio } from '@/lib/voice/cache'

export const maxDuration = 60 // Voice generation can take longer

// Helper to consume readable stream and return Blob
async function streamToBlob(stream: ReadableStream<Uint8Array>): Promise<Blob> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  
  // Calculate total size
  const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  
  // Combine all chunks into a single Uint8Array
  const combined = new Uint8Array(totalSize)
  let offset = 0
  for (const chunk of chunks) {
    combined.set(chunk, offset)
    offset += chunk.length
  }
  
  // Create blob from the combined buffer (as ArrayBuffer)
  return new Blob([combined.buffer as ArrayBuffer], { type: 'audio/mpeg' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, regenerate = false } = body
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }
    
    // Limit text length to prevent abuse
    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 10000 characters.' },
        { status: 400 }
      )
    }

    // Check cache first (unless regenerating)
    if (!regenerate) {
      const cachedUrl = getCachedAudio(text)
      if (cachedUrl) {
        return NextResponse.json({ audioUrl: cachedUrl, cached: true })
      }
    }

    // Generate new audio
    const client = getElevenLabsClient()
    const voiceId = getNarratorVoiceId()
    const model = getNarratorModel()
    
    console.log('[Voice API] Generating audio for text length:', text.length, 'Voice:', voiceId, 'Model:', model)
    
    // Generate audio using ElevenLabs SDK
    // The convert method returns a ReadableStream<Uint8Array>
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      modelId: model,
      outputFormat: 'mp3_44100_128',
    }) as ReadableStream<Uint8Array>
    
    // Convert stream to blob
    const blob = await streamToBlob(audioStream)
    
    // Cache the result
    const audioUrl = setCachedAudio(text, blob)
    
    console.log('[Voice API] Audio generated successfully. Size:', blob.size, 'bytes')
    
    return NextResponse.json({ 
      audioUrl,
      cached: false,
      duration: null, // Could calculate from blob if needed
    })
    
  } catch (error) {
    console.error('[Voice API] Error:', error)
    
    // Determine error type for client
    if (error instanceof Error) {
      if (error.message.includes('ELEVENLABS_API_KEY')) {
        return NextResponse.json(
          { error: 'Voice service not configured. Please set ELEVENLABS_API_KEY.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('quota') || error.message.includes('credits')) {
        return NextResponse.json(
          { error: 'Voice service quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate voice. Please try again.' },
      { status: 500 }
    )
  }
}