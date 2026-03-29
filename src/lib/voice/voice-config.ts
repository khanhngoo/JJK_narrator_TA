// Voice configuration with fallback chain per ARCHITECTURE.md Pattern 5
// Priority: PVC (production) > IVC (development) > Fallback

export const VOICE_CONFIG = {
  JJK_NARRATOR: {
    // Professional Voice Clone (PVC) - highest quality, requires verification
    pvcVoiceId: process.env.ELEVENLABS_JJK_PVC_VOICE_ID,
    
    // Instant Voice Clone (IVC) - fast setup, good for development
    ivcVoiceId: process.env.ELEVENLABS_JJK_IVC_VOICE_ID,
    
    // Fallback to pre-made voice if no clone available
    // Using "Adam" as a placeholder - replace with appropriate narrator-style voice
    fallbackVoiceId: process.env.ELEVENLABS_FALLBACK_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',
    
    // Model selection
    // Use Flash v2.5 for lower latency (~75ms vs ~300ms for Multilingual v2)
    model: process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5',
    
    // Output format
    outputFormat: 'mp3_44100_128' as const,
  },
}

/**
 * Get the narrator voice ID with fallback chain
 * Priority: PVC > IVC > Fallback
 */
export function getNarratorVoiceId(): string {
  const { pvcVoiceId, ivcVoiceId, fallbackVoiceId } = VOICE_CONFIG.JJK_NARRATOR
  
  if (pvcVoiceId) {
    console.log('[Voice] Using PVC voice:', pvcVoiceId)
    return pvcVoiceId
  }
  
  if (ivcVoiceId) {
    console.log('[Voice] Using IVC voice:', ivcVoiceId)
    return ivcVoiceId
  }
  
  console.log('[Voice] Using fallback voice:', fallbackVoiceId)
  return fallbackVoiceId
}

/**
 * Get the model ID for voice synthesis
 */
export function getNarratorModel(): string {
  return VOICE_CONFIG.JJK_NARRATOR.model
}

/**
 * Get the output format for audio
 */
export function getAudioFormat(): string {
  return VOICE_CONFIG.JJK_NARRATOR.outputFormat
}