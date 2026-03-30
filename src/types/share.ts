/**
 * Type definitions for the sharing feature
 * Used by storage module and API routes
 */

export interface SharedAudio {
  id: string          // 8-char random hash
  audioUrl: string    // Vercel Blob URL or public URL
  question: string    // User's original question
  text: string        // AI generated explanation text
  timestamp: number   // Creation timestamp
}

export interface ShareResponse {
  success: boolean
  shareUrl?: string
  shareId?: string
  error?: string
}

export interface ShareData {
  id: string
  audioUrl: string
  question: string
  text: string
  timestamp: number
}
