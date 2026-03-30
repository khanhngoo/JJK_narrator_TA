import { NextRequest, NextResponse } from 'next/server'
import { getSharedAudio } from '@/lib/share/storage'

/**
 * GET /api/share/[id]
 * Retrieves shared audio data by share ID
 * 
 * Response:
 * - id: share ID
 * - audioUrl: URL to the audio file in Vercel Blob
 * - question: User's original question
 * - text: AI generated explanation
 * - timestamp: creation timestamp
 * 
 * Error (404):
 * - error: 'Share not found'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    const shared = await getSharedAudio(id)

    if (!shared) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: shared.id,
      audioUrl: shared.audioUrl,
      question: shared.question,
      text: shared.text,
      timestamp: shared.timestamp
    })
  } catch (error) {
    console.error('[Share API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve share' },
      { status: 500 }
    )
  }
}
