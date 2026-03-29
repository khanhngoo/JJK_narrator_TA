# Project Research Summary

**Project:** JJK Narrator AI Teacher
**Domain:** AI Voice Web Application (Entertainment-First Education)
**Researched:** 2025-03-30
**Confidence:** HIGH

## Executive Summary

The JJK Narrator AI Teacher is an entertainment-first educational web app that explains topics in the dramatic style of the Jujutsu Kaisen anime narrator using authentic voice cloning. This is inherently a **two-stage AI pipeline application**: text generation (LLM) followed by voice synthesis (TTS), with streaming as essential architecture for acceptable latency.

Research strongly recommends **Professional Voice Cloning (PVC)** through ElevenLabs as the core differentiator — generic voice services cannot capture the unique dramatic cadence required for authentic JJK narration. The technical foundation is well-established: Next.js App Router with Vercel AI SDK for streaming text, and ElevenLabs Node SDK for streaming audio. The critical success factor is **sample quality**: lossless audio from official sources featuring the narrator's dramatic explanation style is essential.

**Key risks to mitigate upfront:** (1) Browser autoplay restrictions require explicit user gestures before audio playback — this must be architected into the MVP. (2) Latency kills the dramatic experience — streaming from day one is mandatory. (3) Voice API costs scale rapidly — implement caching before launch. (4) JJK fans will immediately detect AI imitations — validate voice quality with actual fans before shipping.

## Key Findings

### Recommended Stack

The stack is standard for AI web apps but optimized for voice-first experiences. Next.js 16 with App Router provides seamless streaming support and API routes, eliminating the need for a separate backend. ElevenLabs is the clear choice for voice cloning — Professional Voice Cloning (PVC) is required to capture dramatic delivery style, not Instant Voice Cloning. Vercel AI SDK handles LLM orchestration cleanly.

**Core technologies:**
- **Next.js 16 + React 19** — Full-stack framework with built-in streaming, API routes, optimal deployment on Vercel — well-documented patterns for AI apps
- **ElevenLabs PVC** — Voice cloning for authentic JJK narrator voice — market leader with streaming API, emotional synthesis, Node.js SDK — requires 15-30 minutes quality samples
- **Vercel AI SDK + OpenAI GPT-5.4** — Text generation with dramatic JJK persona — unified streaming API, `useChat` hook, optimize prompts for narrator style
- **Tailwind CSS + shadcn/ui** — Rapid dark theme development — JJK aesthetic requires custom styling, shadcn components are copy-paste owned
- **Vercel deployment** — Optimal for Next.js — edge functions, automatic SSL, AI Gateway available

**Critical version requirements:**
- Node.js 18+ (ElevenLabs SDK requirement)
- ElevenLabs Node SDK `@elevenlabs/elevenlabs-js` 2.x
- Vercel AI SDK 6.x with `@ai-sdk/openai` provider

### Expected Features

The MVP focuses on the core voice-explanation loop. Eight features are essential for launch: text input, audio playback controls, JJK-style dramatic explanations, Professional Voice Cloning, dark theme, loading indicators, error handling, and mobile responsiveness. This validates the hypothesis: "JJK fans want explanations in authentic narrator voice."

**Must have (table stakes):**
- Text input field — standard chatbot interaction
- Audio playback with controls (play, pause, replay, progress) — voice apps require listening capability
- Loading/response indicator — users need feedback during generation
- Mobile responsive design — majority of users are mobile-first
- Dark theme UI — matches JJK aesthetic, modern expectation
- Error handling with retry options — graceful degradation

**Should have (differentiators):**
- **Authentic JJK narrator voice cloning (CRITICAL)** — Professional Voice Cloning required, distinct from generic TTS — this is the core differentiator
- **Dramatic JJK-style explanation generation** — Prompt engineering for slow pacing, technique breakdowns, dramatic pauses, "Who is the one who made this possible?" hooks
- **JJK aesthetic/theming** — Domain Expansion visual effects, JJK color palette, typography for immersion
- Session explanation history — revisit favorite explanations

**Defer (v2+):**
- User accounts — not core to entertainment value, adds auth/database complexity
- Multi-language — voice cloning quality degrades, dilutes JJK authenticity
- Character voice selection — multiple PVC models, premium feature
- Real-time voice conversation — doubles complexity, high latency risk

### Architecture Approach

A **two-stage streaming pipeline** is the recommended architecture. Text streams first from the LLM (maintaining engagement), then audio streams from ElevenLabs after text completes. This progressive UX prevents the "stare at loading spinner" problem. Next.js API routes handle both `/api/chat` (text generation with JJK system prompt) and `/api/voice` (ElevenLabs TTS with cloned voice ID).

**Major components:**
1. **Chat UI Component** — Displays streaming text, uses Vercel AI SDK `useChat` hook, shows progressive explanation
2. **Audio Player Component** — Streams audio from `/api/voice`, handles playback controls, manages AudioContext for browser autoplay compliance
3. **API Route Layer** — `/api/chat` for LLM generation with JJK prompt, `/api/voice` for ElevenLabs streaming synthesis
4. **Lib Services** — `lib/ai/prompts.ts` for JJK narrator persona, `lib/voice/elevenlabs.ts` for voice client, `lib/voice/voice-config.ts` for voice ID management

**Critical patterns:**
- Stream text immediately — never block on full generation
- Generate voice asynchronously in `onFinish` callback
- Create AudioContext only after user gesture (click/tap)
- Store voice IDs in environment variables with fallbacks
- Use blob URLs for audio (never store full Blob in React state)

### Critical Pitfalls

1. **Voice cloning sample quality determines success or failure** — Using compressed YouTube audio or wrong speaker samples produces instant "AI fake" detection. Must source lossless Blu-ray/DVD audio with dramatic explanation style. Validate with actual JJK fans before shipping — if 70%+ detect AI, quality is insufficient.

2. **Browser autoplay restrictions block core functionality** — Safari and Chrome require user gesture before AudioContext functions. Solution: design explicit play button, create AudioContext only after first click/tap, test on fresh iOS Safari sessions.

3. **Latency destroys dramatic experience** — JJK narration requires buildup and timing. 5-15 second delays kill immersion. Must stream audio from day one, use fastest ElevenLabs model (Flash v2.5), show progressive feedback (text + audio streaming together), cache common responses.

4. **API cost explosion at scale** — Voice generation is expensive ($0.03-0.15 per explanation). Implement aggressive caching (same question = same audio), per-user rate limits (5 explanations/hour free), cost monitoring alerts from day one. JJK novelty can cause viral traffic spikes.

5. **Entertainment masks education value** — If explanations are only "cool voice" with no substance, novelty wears off and users don't return. Every explanation must have real educational content. Test: "What did you learn?" should have real answers, not just "that was fun."

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Voice Explanation MVP

**Rationale:** The core hypothesis requires validating that authentic JJK narrator voice + dramatic explanations creates engagement. All other features depend on this working. Audio autoplay architecture and streaming patterns must be established correctly from the start — retrofitting is expensive.

**Delivers:** Functional voice explanation app where users can ask questions and hear authentic JJK-style dramatic narrated answers. Text streams first, then audio. Mobile-responsive dark theme UI.

**Addresses:**
- Text input field (table stakes)
- Audio playback controls (table stakes)
- JJK-style dramatic explanations (differentiator)
- Professional Voice Cloning setup (CRITICAL differentiator)
- JJK dark theme UI (differentiator)
- Loading indicators (table stakes)
- Error handling (table stakes)
- Mobile responsive (table stakes)

**Avoids:**
- Voice quality insufficient pitfall — validate with fans before launch
- Autoplay policy failures — design explicit play gesture from day one
- Latency too high — streaming architecture built in
- Cost explosion — implement caching immediately
- Mobile support broken — test on iOS Safari from start
- JJK style overload — prompt testing with varied question types

**Build order within phase:**
1. JJK narrator prompt engineering + chat API route
2. Voice cloning setup (PVC sample sourcing, ElevenLabs voice creation)
3. Audio player with autoplay-compliant architecture
4. UI components (input form, message display, controls)
5. Mobile testing and polish

### Phase 2: Enhanced Experience & Quality

**Rationale:** After core validation, improve UX with session history, sharing, and topic-aware explanation intensity. Cost management becomes important as usage grows.

**Delivers:** Session-based explanation history, shareable audio clips, topic-aware dramatization (calmer for simple questions, more dramatic for complex), rate limiting for cost control.

**Uses:**
- Existing `/api/chat` and `/api/voice` routes
- Session storage (no database yet)
- Audio blob storage for sharing

**Implements:**
- Session history component
- Share functionality with generated audio URLs
- Rate limiting middleware
- Content moderation for generated text

**Addresses:**
- Explanation history (P2 feature)
- Share audio clips (P2 feature, viral potential)
- Topic-aware dramatization (P2 feature)
- Cost management via rate limits

**Avoids:**
- Entertain-first attrition — variety keeps novelty alive
- Security (prompt injection) — add input sanitization, content moderation

### Phase 3: Scale & Monetization

**Rationale:** Only add user accounts and monetization after core experience is validated and polished. This requires infrastructure complexity (auth, database) that's unnecessary for MVP.

**Delivers:** Optional user accounts with OAuth, explanation history persistence, premium features (character voice selection, unlimited explanations), social features if validated.

**Uses:**
- Supabase or similar for auth/database
- Multiple ElevenLabs PVC voices for character selection
- CDN for cached audio at scale

**Addresses:**
- User accounts (v2+ feature, not essential)
- Multi-language support (v2+ feature)
- Character voice selection (premium feature)

**Scaling considerations:**
- Redis/KV for audio caching
- Upstash rate limiting
- Background jobs for audio generation (Inngest/Trigger.dev)
- Multi-region deployment

### Phase Ordering Rationale

- **Phase 1 first:** Core hypothesis validation before any enhancements. Voice quality is foundational — if it's not authentic, nothing else matters. Architecture patterns (streaming, autoplay compliance) are expensive to retrofit.
- **Phase 2 second:** UX enhancements depend on core working. Session history requires explanation generation to exist. Sharing requires audio generation to work. Rate limiting only matters after usage exists.
- **Phase 3 last:** Infrastructure complexity (auth, database, CDN) should be added only after product-market fit. Monetization requires proven engagement.

**Dependency chain:**
- Voice cloning samples → PVC voice creation → Audio generation
- System prompt engineering → Text generation → Streaming UI
- Audio generation working → Audio player → Autoplay-compliant architecture
- Core MVP working → Session features → Social features

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1 (voice cloning setup):** Requires sourcing high-quality JJK narrator audio samples. This is external research — finding Blu-ray rips, extracting clean narrator segments. Sample quality directly impacts product success. May need `/gsd-research-phase` for sample acquisition strategy.
- **Phase 1 (JJK aesthetic):** Specific visual elements, color palette, fonts, Domain Expansion effects need definition. Could research JJK visual design guides or hire JJK-knowledgeable designer.
- **Phase 2 (content moderation):** If implementing text moderation before TTS, research appropriate moderation APIs or local filtering approaches.

Phases with standard patterns (skip research-phase):

- **Phase 1 (Next.js setup):** Well-documented, established patterns. Stack is standard for AI apps.
- **Phase 1 (ElevenLabs integration):** Official SDK, comprehensive documentation, streaming patterns documented.
- **Phase 1 (Vercel AI SDK):** Established patterns, good documentation, `useChat` hook is standard.
- **Phase 3 (Auth/Database):** Supabase OAuth patterns are well-documented, standard PostgreSQL/PostgREST.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are established, well-documented, official SDKs available. Next.js + Vercel AI SDK + ElevenLabs is a proven pattern for voice apps. |
| Features | HIGH | MVP features are table stakes + voice cloning differentiation. Clear prioritization from FEATURES.md. Anti-features are well-defined. |
| Architecture | HIGH | Two-stage streaming pipeline is standard for voice apps. Component boundaries are clear. API route structure follows established Next.js patterns. |
| Pitfalls | HIGH | Pitfalls are well-documented from official sources (OpenAI TTS docs, MDN Web Audio, ElevenLabs). Voice quality pitfalls are domain-expertise but high confidence. |

**Overall confidence:** HIGH

Research draws from official documentation (ElevenLabs API, Vercel AI SDK, OpenAI TTS, MDN Web Audio), established architectural patterns, and domain expertise in voice cloning and AI apps. The only uncertainty is **external: sourcing high-quality JJK narrator audio samples** — this requires accessing anime source material, which is outside technical research scope.

### Gaps to Address

**Gap: JJK narrator audio sample sourcing**
- PVC requires 15-30 minutes of clean narrator audio
- Must source from official Blu-ray/DVD, not YouTube rips (compression artifacts)
- Audio must feature dramatic explanation style (Domain Expansion scenes, technique breakdowns)
- **How to handle:** Create a pre-MVP task for sample sourcing. Consider: extracting from legal anime sources, finding dedicated narrator compilation websites, or recording voice actor impersonations as fallback.

**Gap: JJK visual design specifics**
- Dark theme requires specific color palette, typography, Domain Expansion effects
- Exact hex values, fonts, visual patterns need definition
- **How to handle:** Research JJK visual style guides, or hire JJK-knowledgeable designer for Phase 1 UI polish. Could use color palette from JJK official art.

**Gap: PVC voice ID management**
- Professional Voice Clone requires ElevenLabs verification (~3 hours for English)
- Voice ID must be stored securely in environment variables
- Fallback voice needed for testing before PVC is ready
- **How to handle:** Create IVC (Instant Voice Clone) first for rapid development, then migrate to PVC for production. Document voice ID rotation process.

## Sources

### Primary (HIGH confidence)

- **ElevenLabs API Documentation** — Voice cloning APIs, PVC vs IVC, streaming support, TTS endpoints — https://elevenlabs.io/docs/api-reference
- **Vercel AI SDK Documentation** — `useChat` hook, streaming text, Next.js App Router patterns — https://sdk.vercel.ai/docs
- **OpenAI GPT-5.4 Model Docs** — Model capabilities, context window, creative writing optimization — https://platform.openai.com/docs/models
- **shadcn/ui Installation Guide** — Next.js integration, component library setup — https://ui.shadcn.com/docs/installation/next
- **MDN Web Audio API** — Browser audio handling, autoplay policies, AudioContext — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Secondary (MEDIUM confidence)

- **OpenAI TTS Documentation** — Streaming audio, format options, latency considerations — patterns apply to ElevenLabs streaming
- **ElevenLabs Node SDK** — Official TypeScript SDK implementation — https://github.com/elevenlabs/elevenlabs-js
- **Next.js App Router** — Streaming, API routes, deployment patterns — established patterns for AI apps

### Tertiary (LOW confidence)

- **JJK fan community expectations** — Authenticity is paramount, fans detect AI voice imitations — domain knowledge, needs validation with actual JJK fans
- **Voice cloning quality patterns** — Sample quality requirements, dramatic style preservation — requires pre-MVP testing with different sample sets

---

*Research completed: 2025-03-30*
*Ready for roadmap: yes*