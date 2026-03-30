import { NextRequest, NextResponse } from 'next/server'
import { storeSharedAudio } from '@/lib/share/storage'

/**
 * POST /api/share
 * Creates a shareable link for an audio clip
 * 
 * Request body:
 * - audioData: base64 encoded audio
 * - question: User's original question
 * - text: AI generated explanation
 * 
 * Response:
 * - success: boolean
 * - shareUrl: full URL to the shared clip
 * - shareId: 8-char share ID
 * - error: error message if failed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioData, question, text } = body

    if (!audioData || !question || !text) {
      return NextResponse.json(
        { success: false, error: 'audioData, question, and text are required' },
        { status: 400 }
      )
    }

    // Decode base64 audio to Blob
    const binaryString = atob(audioData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })

    // Store and get share info
    const shared = await storeSharedAudio(audioBlob, question, text)

    // Construct full share URL
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const shareUrl = `${origin}/s/${shared.id}`

    return NextResponse.json({
      success: true,
      shareUrl,
      shareId: shared.id
    })
  } catch (error) {
    console.error('[Share API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create share' },
      { status: 500 }
    )
  }
}
