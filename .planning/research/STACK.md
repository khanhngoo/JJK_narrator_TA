# Stack Research

**Domain:** AI Voice Web App (Text-to-Speech with Voice Cloning)
**Researched:** 2026-03-30
**Confidence:** HIGH

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x | Full-stack React framework | Best for AI apps: serverless API routes, edge runtime, first-class TypeScript, App Router with React Server Components. Vercel AI SDK integrates seamlessly. Minimal config for production deployment. |
| React | 19.x | UI library | Comes with Next.js. Required for any modern web app. Server Components reduce client bundle for this voice-heavy app. |
| TypeScript | 5.x | Type safety | Essential for API integrations (ElevenLabs, OpenAI). Catches errors at compile time. Industry standard. |

### Voice & AI Services

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| ElevenLabs | `@elevenlabs/elevenlabs-js` 2.x | Voice cloning & TTS | Market leader for voice cloning. Professional voice cloning produces high-fidelity replicas needed for authentic JJK narrator voice. Emotional awareness in synthesis captures dramatic JJK style. Streaming API enables real-time playback. Node.js SDK is well-maintained. |
| Vercel AI SDK | 6.x | LLM integration | Unified API across providers. `useChat` hook simplifies chat interface. Handles streaming, tool calls, error recovery. Works with Next.js App Router. Maintained by Vercel team. |
| OpenAI GPT-5.4 | API (model: `gpt-5.4` or `gpt-5.4-mini`) | JJK-style text generation | Best for creative writing tasks. 1M context window handles complex prompts. Can be prompted to write in JJK narrator dramatic style. Use mini for faster/cheaper responses. |

### UI & Styling

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tailwind CSS | 4.x | Utility-first CSS | Default with Next.js. Rapid prototyping. Perfect for custom JJK-themed dark aesthetic. |
| shadcn/ui | Latest | Component library | Best React component library for Next.js. Copy-paste components you own. Built on Radix primitives (accessible). Works perfectly with Tailwind. Industry standard for 2025. |

### Backend Infrastructure

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| Next.js API Routes | Serverless backend | Eliminates need for separate Express server. Runs on Vercel edge. Secure API key storage (ElevenLabs, OpenAI). Handles voice generation requests. |
| Vercel | Deployment | Optimal for Next.js. Automatic SSL, CDN, edge functions. Best DX for deploying AI apps. AI Gateway available for provider abstraction. |

### Audio Playback

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| HTML5 Audio API | Browser audio playback | Native browser support. No dependencies. Full control over playback (play, pause, seek, events). MP3 from ElevenLabs plays directly. |
| Web Audio API (optional) | Advanced audio processing | If you need visualizations or effects. Native browser API. No package needed. |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | 3.x | Schema validation | Validate user input before sending to LLM. Type inference from schemas. |
| `clsx` + `tailwind-merge` | Latest | Class name utilities | Combine Tailwind classes conditionally without conflicts. |
| `lucide-react` | Latest | Icon library | Clean, consistent icons. Recommended by shadcn/ui. |
| `@radix-ui/react-dialog` | Latest | Modal dialogs | For confirmation dialogs, settings. Used by shadcn/ui internally. |
| `sonner` | Latest | Toast notifications | Popularity with shadcn/ui ecosystem. Simple API. |

---

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Comes with Next.js. Add `@typescript-eslint` rules. |
| Prettier | Code formatting | Add `prettier-plugin-tailwindcss` for class sorting. |
| TypeScript strict mode | Type checking | Enable in `tsconfig.json` for safety. |

---

## Installation

```bash
# Core
npx create-next-app@latest jjk-teacher --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Voice & AI
npm install @elevenlabs/elevenlabs-js ai @ai-sdk/openai

# UI Components
npx shadcn@latest init
npx shadcn@latest add button card input textarea

# Utilities
npm install zod clsx tailwind-merge lucide-react sonner

# Dev dependencies (included with Next.js)
# - typescript
# - eslint
# - tailwindcss
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| ElevenLabs | OpenAI TTS | If you don't need voice cloning. OpenAI TTS is simpler but lacks voice cloning. Use models like `gpt-4o-mini-tts` for basic TTS. |
| ElevenLabs | PlayHT | If ElevenLabs doesn't have the voice quality you need. PlayHT has excellent ultra-realistic voices but smaller ecosystem. |
| OpenAI GPT-5.4 | Anthropic Claude 4 Sonnet | If you prefer Anthropic's approach. Also supported by Vercel AI SDK (`@ai-sdk/anthropic`). Slightly different writing style. |
| Next.js | Remix | If you prefer web standards over React conventions. Less AI SDK integration examples available. |
| shadcn/ui | Radix UI directly | If you want full control without copy-paste overhead. More setup work. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-offline` / PWA setup (MVP phase) | Adds complexity for feature not needed. JJK teacher doesn't need offline mode. | Focus on core functionality first. Add later if users demand offline. |
| Reactive State (MobX, Zustand) | Overkill for this app. React state and server state from AI are sufficient. | Use React `useState` for client state. Let the AI SDK handle streaming state. |
| Raw WebSockets for voice | Reimplementing what ElevenLabs SDK already provides. Adds complexity. | Use the `@elevenlabs/elevenlabs-js` SDK which handles streaming internally. |
| Express.js backend | Next.js API Routes already handle backend needs. Two servers = double complexity. | Use Next.js API Routes for all backend logic. |
| SQLite / Local database | Not needed for MVP. No user accounts, no history persistence yet. | Skip database entirely. If needed later, Supabase (PostgreSQL) for full features. |

---

## Stack Patterns by Variant

**If cost is critical:**
- Use `gpt-5.4-mini` instead of `gpt-5.4` for text generation
- Use ElevenLabs Flash v2.5 model (`eleven_flash_v2_5`) over Multilingual v2 (50% cheaper)
- Cache generated audio for repeated questions
- Because: These are the biggest cost drivers for this app

**If latency is critical:**
- Use ElevenLabs Flash v2.5 (~75ms latency)
- Stream responses from AI SDK instead of waiting for full completion
- Pre-warm API connections
- Because: User experience suffers with delays in voice apps

**If building for scale:**
- Add Redis/KV for audio caching
- Add rate limiting with Upstash
- Move API calls to background jobs with Inngest or Trigger.dev
- Because: API rate limits and costs will become issues at scale

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16+ | React 19 | React 19 is bundled with Next.js App Router |
| `@elevenlabs/elevenlabs-js` 2.x | Node.js 18+ | Requires Node 18 for native fetch |
| Vercel AI SDK 6.x | OpenAI SDK 4.x | Use `@ai-sdk/openai` provider package |
| shadcn/ui | Tailwind 4.x | Uses Tailwind v4 syntax |
| TypeScript 5.x | All packages | Strict mode recommended |

---

## Environment Variables Required

```env
# .env.local
ELEVENLABS_API_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here

# Optional for Vercel deployment
VERCEL_URL=your-deployment.vercel.app
```

---

## API Integration Patterns

### ElevenLabs Voice Generation Flow

```typescript
// lib/elevenlabs.ts
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const client = new ElevenLabsClient();

export async function generateNarratorAudio(text: string, voiceId: string) {
  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    modelId: 'eleven_multilingual_v2', // Best quality for dramatic narration
  });
  
  return audio; // Returns audio buffer
}

// For streaming (lower latency):
export async function streamNarratorAudio(text: string, voiceId: string) {
  const stream = await client.textToSpeech.stream(voiceId, {
    text,
    modelId: 'eleven_flash_v2_5', // ~75ms latency
  });
  
  return stream;
}
```

### AI SDK Text Generation Flow

```typescript
// app/api/explain/route.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { question } = await req.json();
  
  const { text } = await generateText({
    model: openai('gpt-5.4-mini'), // Faster for this use case
    system: `You are the dramatic narrator from Jujutsu Kaisen. Explain topics 
    in the slow, detailed, technique-breakdown style the anime narrator uses.
    Use dramatic pauses, reveal hidden mechanics, and build tension.
    Examples: "Who is the one who made Domain Expansion possible?"`,
    prompt: question,
  });
  
  return Response.json({ explanation: text });
}
```

---

## Sources

- **ElevenLabs API Reference** — https://elevenlabs.io/docs/api-reference/introduction — Official documentation with streaming support, model comparison
- **ElevenLabs Node SDK** — https://github.com/elevenlabs/elevenlabs-js — Official TypeScript SDK, voice cloning, TTS APIs
- **Vercel AI SDK** — https://sdk.vercel.ai/docs/introduction — Unified LLM integration, Next.js patterns, streaming support
- **OpenAI GPT-5.4 Model Docs** — https://platform.openai.com/docs/models/gpt-5.4 — Model capabilities, pricing, context window
- **shadcn/ui Installation** — https://ui.shadcn.com/docs/installation/next — Next.js integration, component setup
- **Next.js Installation Guide** — https://nextjs.org/docs/app/getting-started/installation — App Router, TypeScript setup

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Voice/TTS | HIGH | ElevenLabs is clearly the market leader for voice cloning. Official Node SDK, streaming support, emotional synthesis. Well-documented. |
| LLM Integration | HIGH | Vercel AI SDK is the standard for Next.js + AI. OpenAI GPT-5.4 for creative writing is well-suited. |
| Frontend Stack | HIGH | Next.js + shadcn/ui is the industry standard for 2025. Excellent DX, strong ecosystem. |
| Backend/Infra | HIGH | Vercel + Next.js API Routes is the optimal deployment for this app. No database needed for MVP. |

---

*Stack research for: AI voice web app with text-to-speech/voice cloning*
*Researched: 2026-03-30*