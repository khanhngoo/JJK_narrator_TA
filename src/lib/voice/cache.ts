/**
 * In-memory cache for generated audio URLs
 * Key: hash of text content
 * Value: blob URL of generated audio
 * 
 * Note: This is a simple in-memory cache. For production, consider:
 * - Redis/KV for distributed caching
 * - S3/R2 for persistent audio storage
 * - Hash: text content hash for deduplication
 */

interface CacheEntry {
  audioUrl: string
  text: string
  timestamp: number
  blob: Blob // Keep reference to prevent garbage collection
}

// Cache with max 50 entries (LRU-style eviction)
const MAX_CACHE_SIZE = 50
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

const audioCache = new Map<string, CacheEntry>()

/**
 * Generate a simple hash for cache key
 * Uses DJB2 algorithm for fast hashing
 */
function hashText(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

/**
 * Get cached audio URL for text
 * Returns null if not cached or expired
 */
export function getCachedAudio(text: string): string | null {
  const key = hashText(text)
  const entry = audioCache.get(key)
  
  if (!entry) {
    return null
  }
  
  // Check if expired (30 minutes TTL)
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    audioCache.delete(key)
    return null
  }
  
  console.log('[Cache] Hit for text hash:', key)
  return entry.audioUrl
}

/**
 * Cache audio URL for text
 * Creates a blob URL and stores it
 */
export function setCachedAudio(text: string, blob: Blob): string {
  const key = hashText(text)
  
  // Create blob URL
  const audioUrl = URL.createObjectURL(blob)
  
  // Store in cache
  audioCache.set(key, {
    audioUrl,
    text: text.slice(0, 100), // Store first 100 chars for debugging
    timestamp: Date.now(),
    blob, // Keep reference
  })
  
  // LRU eviction if over limit
  if (audioCache.size > MAX_CACHE_SIZE) {
    // Delete oldest entry
    const oldestKey = Array.from(audioCache.keys())[0]
    if (oldestKey) {
      const oldEntry = audioCache.get(oldestKey)
      if (oldEntry) {
        URL.revokeObjectURL(oldEntry.audioUrl)
      }
      audioCache.delete(oldestKey)
    }
  }
  
  console.log('[Cache] Set for text hash:', key, 'Size:', audioCache.size)
  return audioUrl
}

/**
 * Clear the entire cache
 * Useful for testing or manual cleanup
 */
export function clearCache(): void {
  const entries = Array.from(audioCache.values())
  for (const entry of entries) {
    URL.revokeObjectURL(entry.audioUrl)
  }
  audioCache.clear()
  console.log('[Cache] Cleared')
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: audioCache.size,
    keys: Array.from(audioCache.keys()),
  }
}