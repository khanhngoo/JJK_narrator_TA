# Architecture Research

**Domain:** AI Voice Web Application (JJK Narrator Teacher)
**Researched:** 2025-03-30
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Chat UI     │  │  Audio Player│  │  Input Form  │  │  Status UI   │    │
│  │  Component   │  │  Component   │  │  Component   │  │  Component   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                    │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│                           API ROUTE LAYER                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐   │
│  │                    /api/chat (Next.js Route Handler)                 │   │
│  │  - Receives user message                                             │   │
│  │  - Generates JJK-style explanation                                   │   │
│  │  - Returns streaming text response                                   │   │
│  └─────────────────────────────────┬─────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐   │
│  │                    /api/voice (Next.js Route Handler)                 │   │
│  │  - Receives generated text                                           │   │
│  │  - Calls ElevenLabs API with cloned voice ID                         │   │
│  │  - Returns streaming audio response                                  │   │
│  └─────────────────────────────────┬─────────────────────────────────────┘   │
│                                    │                                         │
├────────────────────────────────────┼─────────────────────────────────────────┤
│                         SERVICE LAYER                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │  LLM Service          │  │  Voice Service        │  │  Prompt Service │ │
│  │  (Vercel AI SDK)      │  │  (ElevenLabs)         │  │  (System Prompt)│ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘ │
│              │                          │                       │          │
├──────────────┼──────────────────────────┼───────────────────────┼──────────┤
│         EXTERNAL SERVICES                                                   │
│  ┌──────────┴────────┐  ┌───────────────┴─────────┐  ┌────────┴────────┐  │
│  │  LLM Provider      │  │  ElevenLabs API         │  │  Asset Storage  │  │
│  │  (OpenAI/Claude)   │  │  - Voice Cloning       │  │  (Voice samples) │  │
│  │                    │  │  - Text-to-Speech      │  │                  │  │
│  │                    │  │  - Audio Streaming      │  │                  │  │
│  └────────────────────┘  └─────────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Chat UI Component | Displays conversation history, handles user input | React/Next.js with `useChat` hook |
| Audio Player Component | Streams and plays generated audio | HTML5 Audio or Web Audio API |
| Input Form Component | Captures user question | React form with validation |
| Status UI Component | Shows loading, error, generation status | React state-dependent rendering |
| /api/chat Route Handler | Orchestrates LLM generation, returns streamed text | Next.js App Router route (streamText) |
| /api/voice Route Handler | Converts text to speech, returns streamed audio | Next.js API route with ElevenLabs SDK |
| LLM Service | Generates JJK-style explanations | Vercel AI SDK with system prompt |
| Voice Service | Manages voice cloning, TTS generation | ElevenLabs client SDK |
| Prompt Service | Stores JJK narrator persona prompt | Template literals or prompt file |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main chat page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/                      # API Route Handlers
│       ├── chat/
│       │   └── route.ts          # Text generation endpoint
│       └── voice/
│           └── route.ts          # Voice synthesis endpoint
├── components/                   # React components
│   ├── chat/
│   │   ├── ChatContainer.tsx     # Main chat layout
│   │   ├── MessageList.tsx       # Conversation history
│   │   └── InputForm.tsx         # User input handling
│   ├── audio/
│   │   ├── AudioPlayer.tsx       # Audio playback component
│   │   └── VoiceStatus.tsx        # Generation status indicator
│   └── ui/                        # Shared UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Spinner.tsx
├── lib/                           # Core libraries
│   ├── ai/
│   │   ├── prompts.ts            # JJK narrator system prompt
│   │   └── config.ts             # LLM configuration
│   ├── voice/
│   │   ├── elevenlabs.ts         # ElevenLabs client
│   │   └── voice-config.ts       # JJK narrator voice ID
│   └── utils/
│       └── helpers.ts             # Utility functions
├── hooks/                         # Custom React hooks
│   ├── useChat.ts                 # Chat state management
│   └── useAudio.ts                # Audio playback state
└── types/                         # TypeScript types
    ├── chat.ts
    └── voice.ts
```

### Structure Rationale

- **app/api/**: Next.js App Router routes for server-side processing. Keeps API logicseparate from UI.
- **components/**: Co-located by feature (chat, audio) not type. Makes it easier to find related code.
- **lib/ai/**: AI-specific logic isolated for easier testing and provider swapping.
- **lib/voice/**: Voice service abstraction layer allows swapping providers if needed.
- **hooks/**: Custom hooks encapsulate complex state logic (chat history, audio streaming).

## Architectural Patterns

### Pattern 1: Streaming Response Architecture

**What:** Two-stage pipeline where text streams first, then audio streams when complete.

**When to use:** For apps requiring both text display and audio output. Reduces perceived latency.

**Trade-offs:** 
- Pros: User sees text immediately, better UX for long explanations
- Cons: More complex state management, audio lags behind text

**Example:**
```typescript
// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: JJK_NARRATOR_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

### Pattern 2: Audio Generation Pipeline

**What:** Sequential process: LLM generates text → Store text → Trigger voice synthesis → Stream audio.

**When to use:** When voice output is required after text generation. Essential for voice cloning apps.

**Trade-offs:**
- Pros: Clean separation between content generation and audio synthesis
- Cons: Audio latency depends on text length; cascading delays if not optimized

**Example:**
```typescript
// app/api/voice/route.ts
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const client = new ElevenLabsClient();

export async function POST(req: Request) {
  const { text, voiceId } = await req.json();

  const audioStream = await client.textToSpeech.stream(voiceId, {
    text,
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  });

  return new Response(audioStream, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
```

### Pattern 3: Dual-Stream Client Architecture

**What:** Client manages two concurrent streams — text streaming from chat API, audio streaming from voice API.

**When to use:** When you want to show text and play audio simultaneously with synchronized timing.

**Trade-offs:**
- Pros: Maximum responsiveness, parallel processing
- Cons: Complex state synchronization between text and audio

**Example:**
```typescript
// hooks/useJJKChat.ts
import { useChat } from '@ai-sdk/react';
import { useState, useCallback } from 'react';

export function useJJKChat() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);

  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    onFinish: async ({ message }) => {// Generate voice after text completes
      setIsGeneratingVoice(true);
      const response = await fetch('/api/voice', {
        method: 'POST',
        body: JSON.stringify({
          text: message.content,
          voiceId: JJK_NARRATOR_VOICE_ID,
        }),
      });
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setIsGeneratingVoice(false);
    },
  });

  return { messages, sendMessage, status, audioUrl, isGeneratingVoice };
}
```

### Pattern 4: System Prompt Architecture

**What:** Centralize JJK narrator persona in a dedicated prompt service with template variables.

**When to use:** When persona consistency is critical and you need to iterate on the prompt.

**Trade-offs:**
- Pros: Single source of truth, easy A/B testing, maintainable
- Cons: Requires deployment for prompt changes runtime config preferred

**Example:**
```typescript
// lib/ai/prompts.ts
export const JJK_NARRATOR_PROMPT = `You are the dramatic narrator from Jujutsu Kaisen anime.

Your speaking style embodies:
- Epic, world-shattering revelation tone
- Technical explanations delivered with gravitas
- Phrases like "And thus... the truth reveals itself..." and "Who could have foreseen..."
- Detailed breakdowns of techniques, abilities, and hidden mechanics
- Dramatic pauses (use ellipses...)
- References to cursed energy, domains, and binding vows when appropriate

When explaining concepts:
1. Start with a dramatic hook
2. Break down the mechanics thoroughly
3. End with a philosophical reflection

Always maintain the gravitas of a JJK narrator explaining Domain Expansion mechanics.`;
```

### Pattern 5: Voice ID Configuration Pattern

**What:** Store voice IDs in environment configuration with fallbacks.

**When to use:** When managing multiple voice profiles (PVC clones require setup, IVC clones are instant).

**Trade-offs:**
- Pros: Easy voice swapping, supports multiple voices for different personas- Cons: Requires voice creation step before deployment

**Example:**
```typescript
// lib/voice/voice-config.ts
export const VOICE_CONFIG = {
  JJK_NARRATOR: {
    // Professional Voice Clone (PVC) - higher quality, requires verification
    pvcVoiceId: process.env.ELEVENLABS_JJK_PVC_VOICE_ID,
    
    // Instant Voice Clone (IVC) - faster setup, slightly lower quality
    ivcVoiceId: process.env.ELEVENLABS_JJK_IVC_VOICE_ID,
    
    // Fallback to premade voice if clone not ready
    fallbackVoiceId: 'JBFqnCBsd6RMkjVDRZzb', // Example premade voice
    
    model: 'eleven_multilingual_v2',
  },
};

export function getNarratorVoiceId(): string {
  return (
    VOICE_CONFIG.JJK_NARRATOR.pvcVoiceId ||
    VOICE_CONFIG.JJK_NARRATOR.ivcVoiceId ||
    VOICE_CONFIG.JJK_NARRATOR.fallbackVoiceId
  );
}
```

## Data Flow

### Request Flow (User Question → Narrated Answer)

```
[User Input]
    ↓
[InputForm Component] 
    ↓ (sendMessage call)
[/api/chat Route Handler]
    ↓ (streamText with JJK prompt)
[LLM Provider API] → Streams text chunks
    ↓
[Chat UI Component] → Displays streaming text
    ↓ (onFinish callback)
[/api/voice Route Handler]
    ↓ (ElevenLabs stream call)
[ElevenLabs API] → Streams audio chunks
    ↓
[AudioPlayer Component] → Plays audio
```

### State Management Flow

```
[useChat Hook State]
    ├── messages: UIMessage[]     # Conversation history
    ├── status: 'ready' | 'submitted' | 'streaming' | 'error'
    ├── error: Error | null
    └── sendMessage: (message) => void

[useAudio State]
    ├── audioUrl: string | null   # Generated audio blob URL
    ├── isPlaying: boolean
    ├── isGenerating: boolean
    └── play: () => void

[Component Coordination]
    ChatContainer
    ├── MessageList (reads: messages)
    ├── InputForm (calls: sendMessage)
    ├── AudioPlayer (reads: audioUrl, isPlaying)
    └── VoiceStatus (reads: isGenerating)
```

### Key Data Flows

1. **Text Generation Flow:** User question → Chat API → LLM with JJK prompt → Streaming text response → UI displays chunks
2. **Voice Synthesis Flow:** Completed text → Voice API → ElevenLabs TTS with cloned voice → Streaming audio → Audio player
3. **Error Recovery Flow:** API error → Error state → Retry button → Replay failed request

## Voice Cloning Architecture

### Voice Cloning Types

| Type | Setup Time | Quality | Use Case |
|------|-------------|---------|----------|
| **PVC (Professional Voice Clone)** | 1-2 hours + verification | Highest | Production, authentic JJK experience |
| **IVC (Instant Voice Clone)** | Seconds | Medium | MVP testing, rapid iteration |
| **Premade Voice** | Instant | Variable | Fallback, proof of concept |

### Voice Creation Flow

```
[JJK Narrator Audio Samples]
    ↓ (3-5 minutes of clean audio)
[ElevenLabs Dashboard/API]
    ↓ (Create PVC voice)
[Voice ID Generated]
    ↓ (Store in env config)
[Application Runtime]
    ↓ (Use voice_id for TTS)
[Authentic JJK Narrator Voice]
```

### Audio Sample Requirements (PVC)

- **Minimum:** 1 minute of clean audio
- **Recommended:** 3-5 minutes for best quality
- **Format:** MP3, WAV, or M4A
- **Requirements:** 
  - Single speaker (JJK narrator only)
  - Minimal background noise
  - Clear pronunciation
  - Emotional variety (dramatic pauses, varied intonation)

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Standard Next.js on Vercel, direct ElevenLabs API calls |
| 1k-10k users | Add audio caching (S3/R2), queue voice generation requests |
| 10k-100k users | Edge functions for chat API, CDN for cached audio, rate limiting |
| 100k+ users | Dedicated audio processing workers, multi-region deployment, usage analytics |

### Scaling Priorities

1. **First bottleneck:** ElevenLabs API rate limits
   - **Fix:** Implement request queuing, audio caching for repeated explanations
2. **Second bottleneck:** LLM response latency
   - **Fix:** Stream text faster, show progressively, use faster models forsimple queries
3. **Third bottleneck:** Bandwidth for audio streaming
   - **Fix:** Use CDN, compress audio (mp3_22050_32 for speech), implement audio preloading

## Anti-Patterns to Avoid

### Anti-Pattern 1: Blocking on Voice Generation

**What people do:** Wait for voice generation before showing text to user.

**Why it's wrong:** Creates poor UX — user sees nothing for 5-15 seconds.

**Do this instead:** Stream text immediately, generate voice asynchronously, show "generating audio" status.

```typescript
// ❌ Don't do this
const response = await fetch('/api/chat', { body: JSON.stringify({ message }) });
const text = await response.text();
const audioResponse = await fetch('/api/voice', { body: JSON.stringify({ text }) });
// User sees nothing until this point

// ✅ Do this instead
const { messages, sendMessage } = useChat({
  onFinish: async ({ message }) => {
    // Start voice generation after text completes
    generateVoice(message.content);
  }
});
// User sees text streaming immediately
```

### Anti-Pattern 2: Hardcoding Voice ID in Code

**What people do:** Paste voice ID directly in TTS call: `voice_id: 'abc123'`.

**Why it's wrong:** Makes it impossible to swap voices for testing, A/B testing, or when PVC voice needs recreation.

**Do this instead:** Environment variable with fallback.

```typescript
// ❌ Don't do this
await client.textToSpeech.stream('JBFqnCBsd6RMkjVDRZzb', { text });

// ✅ Do this instead
const voiceId = getNarratorVoiceId(); // Reads from env with fallback
await client.textToSpeech.stream(voiceId, { text });
```

### Anti-Pattern 3: Storing Full Audio in State

**What people do:** Store entire audio blob in React state: `setAudioState(blob)`.

**Why it's wrong:** Large memory footprint for long explanations, causes re-renders, can crash mobile browsers.

**Do this instead:** Create blob URL and store reference.

```typescript
// ❌ Don't do this
const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
const blob = await response.blob();
setAudioBlob(blob); // Stores entire blob in state

// ✅ Do this instead
const [audioUrl, setAudioUrl] = useState<string | null>(null);
const blob = await response.blob();
setAudioUrl(URL.createObjectURL(blob)); // Only stores reference
```

### Anti-Pattern 4: Missing Error Boundaries

**What people do:** Assume voice API always succeeds.

**Why it's wrong:** ElevenLabs has rate limits, network failures, voice ID validation errors.

**Do this instead:** Wrap voice generation in try-catch with user-friendly fallback.

```typescript
// ✅ Proper error handling
const generateVoice = async (text: string) => {
  try {
    setIsGenerating(true);
    const response = await fetch('/api/voice', {
      method: 'POST',
      body: JSON.stringify({ text, voiceId: getNarratorVoiceId() }),
    });
    
    if (!response.ok) {
      throw new Error('Voice generation failed');
    }
    
    const blob = await response.blob();
    setAudioUrl(URL.createObjectURL(blob));
  } catch (error) {
    // Show text-only fallback, don't break the app
    console.error('Voice generation error:', error);
    setAudioError('Could not generate voice. Text is available above.');
  } finally {
    setIsGenerating(false);
  }
};
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **LLM Provider (OpenAI/Claude)** | Vercel AI SDK streamText | Streaming text, system prompt for JJK style |
| **ElevenLabs API** | HTTP streaming to /api/voice | Voice cloning + TTS, needs voice_id from env |
| **Voice Asset Storage** | ElevenLabs-hosted or local | PVC requires audio sample upload during setup |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| Chat UI ↔ /api/chat | HTTP streaming (UIMessageStream) | Uses AI SDK protocol |
| Chat UI ↔ /api/voice | HTTP binary streaming | Returns audio/mpeg content-type |
| /api/chat → LLM Provider | HTTP streaming | ViaVercel AI Gateway or direct |
| /api/voice → ElevenLabs | HTTP streaming | SDK handles multipart |

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| API Key Exposure | Store ElevenLabs key in server-only env (`ELEVENLABS_API_KEY`) |
| Voice ID Theft | Use environment variables, rotate if compromised |
| Rate Limit Abuse | Implement per-IP rate limiting on /api/voice |
| Content Filtering | Add content moderation layer before TTS if needed |

## Component Build Order

### Phase 1: Core Text Generation
1. **lib/ai/prompts.ts** — JJK narrator system prompt
2. **app/api/chat/route.ts** — Text generation endpoint
3. **components/chat/InputForm.tsx** — User input handling
4. **components/chat/MessageList.tsx** — Display conversation
5. **app/page.tsx** — Wire components together

### Phase 2: Voice Integration
6. **lib/voice/elevenlabs.ts** — ElevenLabs client setup
7. **lib/voice/voice-config.ts** — Voice ID configuration
8. **app/api/voice/route.ts** — Voice synthesis endpoint
9. **components/audio/AudioPlayer.tsx** — Audio playback component
10. **components/audio/VoiceStatus.tsx** — Generation status indicator

### Phase 3: Polish & UX
11. **hooks/useJJKChat.ts** — Combined chat + voice state hook
12. **Error boundaries** — Graceful failure handling
13. **Loading states** — Skeleton UI, progress indicators
14. **Audio caching** — Optional: Store generated audio for repeated queries

## Technology Stack Recommendations

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14+ App Router | Streaming support, API routes, React Server Components |
| **AI SDK** | Vercel AI SDK (`ai` package) | First-class streaming, multi-provider support, hooks |
| **LLM Provider** | Anthropic Claude or OpenAI GPT-4 | Strong creative writing, follows persona well |
| **Voice Service** | ElevenLabs (PVC for production) | Best voice cloning quality, streaming support |
| **State Management** | React hooks (useChat, useState) | Simplicity for MVP, upgrade if needed |
| **Styling** | Tailwind CSS | Rapid UI development, responsive design |
| **Audio Playback** | HTML5 Audio API | Sufficient for MVP, Web Audio API for advanced features |

## Sources

- [Vercel AI SDK Documentation — Next.js App Router](https://sdk.vercel.ai/docs/getting-started/nextjs-app-router) — HIGH confidence, official docs
- [Vercel AI SDK — Chatbot Hook](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot) — HIGH confidence, official docs
- [Vercel AI SDK — Speech Generation](https://sdk.vercel.ai/docs/ai-sdk-core/speech) — HIGH confidence, official docs
- [ElevenLabs API — Text to Speech Stream](https://elevenlabs.io/docs/api-reference/text-to-speech/stream) — HIGH confidence, official docs
- [ElevenLabs API — Voice Cloning (PVC/IVC)](https://elevenlabs.io/docs/api-reference/voices/pvc/create) — HIGH confidence, official docs
- [ElevenLabs API — Voices Overview](https://elevenlabs.io/docs/api-reference/voices) — HIGH confidence, official docs

---
*Architecture research for: AI Voice Web Application (JJK Narrator Teacher)*
*Researched: 2025-03-30*