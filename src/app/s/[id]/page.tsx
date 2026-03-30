'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { Button } from '@/components/ui/button'
import { Copy, Loader2, AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

interface ShareData {
  id: string
  audioUrl: string
  question: string
  text: string
  timestamp: number
}

export default function SharePage() {
  const params = useParams()
  const id = params.id as string
  
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchShare() {
      try {
        const response = await fetch(`/api/share/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('This share link is invalid or has expired.')
          } else {
            setError('Failed to load shared audio.')
          }
          return
        }
        const data = await response.json()
        setShareData(data)
      } catch (err) {
        setError('Failed to load shared audio.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchShare()
    }
  }, [id])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading shared narration...</p>
        </div>
      </div>
    )
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-semibold mb-2">Share Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'This share link is invalid or has expired.'}
          </p>
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Create Your Own Narration
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            JJK Narrator Teacher
          </h1>
          <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-2">
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Question section */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">The user asked:</p>
          <h2 className="text-lg font-medium text-foreground">
            {shareData.question}
          </h2>
        </div>

        {/* Audio player */}
        <div className="mb-8">
          <AudioPlayer 
            audioUrl={shareData.audioUrl}
            className="bg-card border border-border"
          />
        </div>

        {/* Explanation text */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            The narrator explains:
          </p>
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {shareData.text}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              Create Your Own Narration
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
