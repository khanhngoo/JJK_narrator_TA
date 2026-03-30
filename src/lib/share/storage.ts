/**
 * Vercel Blob storage module for persistent shareable audio
 * 
 * Uses Vercel Blob for storage with 8-char nanoid identifiers.
 * Audio files stored as public MP3, metadata as JSON alongside.
 */

import { put, get } from '@vercel/blob'
import { nanoid } from 'nanoid'

export interface SharedAudio {
  id: string
  audioUrl: string
  question: string
  text: string
  timestamp: number
}

/**
 * Store audio blob and metadata in Vercel Blob
 * Returns SharedAudio object with share ID and URL
 */
export async function storeSharedAudio(
  audioBlob: Blob,
  question: string,
  text: string
): Promise<SharedAudio> {
  const id = nanoid(8) // 8-char unique ID
  
  // Store audio file in Vercel Blob with public access
  const audioBlobResult = await put(
    `audio/${id}.mp3`,
    audioBlob,
    { access: 'public', contentType: 'audio/mpeg' }
  )
  
  // Store metadata alongside
  const metadata = {
    id,
    audioUrl: audioBlobResult.url,
    question,
    text,
    timestamp: Date.now()
  }
  
  await put(
    `metadata/${id}.json`,
    JSON.stringify(metadata),
    { access: 'public', contentType: 'application/json' }
  )
  
  return metadata
}

/**
 * Retrieve shared audio by ID
 * Returns SharedAudio object or null if not found
 */
export async function getSharedAudio(id: string): Promise<SharedAudio | null> {
  try {
    const result = await get(`metadata/${id}.json`, { access: 'public' })
    
    if (!result || result.statusCode !== 200 || !result.stream) {
      return null
    }
    
    // Consume the stream to get text content
    const reader = result.stream.getReader()
    const chunks: Uint8Array[] = []
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }
    
    // Combine all chunks into a single Uint8Array
    const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const combined = new Uint8Array(totalSize)
    let offset = 0
    for (const chunk of chunks) {
      combined.set(chunk, offset)
      offset += chunk.length
    }
    
    // Convert to string (JSON text)
    const decoder = new TextDecoder()
    const jsonText = decoder.decode(combined)
    
    return JSON.parse(jsonText) as SharedAudio
  } catch {
    return null
  }
}
