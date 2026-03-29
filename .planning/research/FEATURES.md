# Feature Research

**Domain:** AI Voice Educational Web App (Entertainment-First)
**Project:** JJK Narrator AI Teacher
**Researched:** 2025-03-30
**Confidence:** HIGH

## Executive Summary

This document maps the feature landscape for AI voice educational web apps with an entertainment-first approach. The JJK Narrator AI Teacher differentiates itself through authentic voice cloning and dramatic narration style — transforming educational explanations into epic JJK-style revelations. Research draws from ElevenLabs voice cloning documentation, Synthesia AI video platform, and general AI educational app patterns.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Text input field | Standard interaction pattern for chatbots | LOW | Simple form input, character limits optional |
| Audio playback controls | Voice apps must let users listen | LOW | Play, pause, replay, progress bar, volume |
| Loading/response indicator | Users need feedback during AI generation | LOW | Spinner, skeleton, or streaming indicator |
| Mobile responsive design | Majority of users are mobile-first | LOW | CSS responsive, touch-friendly controls |
| Clear call-to-action | Users need guidance on what to do | LOW | Prominent input field, "Ask" button |
| Error handling | Things fail; graceful degradation expected | MEDIUM | Fallback messages, retry options |
| Dark theme UI | Matches JJK aesthetic, modern trend | LOW | CSS theme, reduces eye strain |
| Basic styling consistency | Professional appearance expected | LOW | Matching fonts, colors, spacing |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required for basic function, but create unique value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Authentic JJK narrator voice cloning** | CORE DIFFERENTIATOR — fans expect the real voice | HIGH | Requires Professional Voice Cloning (ElevenLabs), need quality audio samples from JJK anime |
| **Dramatic JJK-style explanation generation** | Transforms boring topics into epic revelations | MEDIUM | Prompt engineering for narrator style: slow pacing, technique breakdowns, dramatic pauses |
| **JJK aesthetic/theming** | Immersive fan experience | LOW-MEDIUM | Domain Expansion visual effects, JJK color palette, typography |
| **Reference callbacks** | "Who is the one who made this possible?" style hooks | MEDIUM | Inject JJK-style phrases, technique references dynamically |
| **Topic-aware dramatization** | Matches explanation intensity to topic | MEDIUM | More dramatic for complex topics, calmer for simple ones |
| **Character-style explanations** | Different JJK character voices (optional future) | HIGH | Could offer Gojo, Sukuna, Nanami voices as premium feature |
| **Share audio clips** | Viral potential for anime communities | MEDIUM | Generate shareable audio clips for social media |
| **Explanation history** | Users revisit favorite explanations | MEDIUM | Simple session storage or optional account system |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems or dilute the core value.

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Real-time voice conversation | "Like talking to the narrator" | Doubles complexity, requires WebRTC/streaming, high latency risk for v1 | Text input → Audio output is simpler, sets clear expectations |
| Multi-language support | "Broader audience" | Voice cloning quality degrades for non-English, prompt engineering per language, dilutes JJK authenticity | Focus on English first, add languages after voice cloning is perfected |
| User accounts/history | "Save my explanations" | Adds auth, database, privacy concerns for v1 | Session-only storage, optional accounts in v2 |
| Unlimited free tier | "I want free access" | Voice API costs are real ($$$), audio generation is expensive | Daily/monthly limits, freemium model |
| Chat history | "Continue conversations" | Breaks single-explanation format, increases token costs | Each question is independent dramatization |
| Text-only output | "I just want to read" | Undermines core differentiator (voice cloning) | If user wants text, show explanation alongside audio |
| Multiple AI models | "Let me choose GPT/Claude/etc" | Adds complexity, different prompt templates per model | Start with one high-quality model, optimize prompts |
| Social features | "Share with friends, comments" | Scope creep, moderation burden, not core to entertainment value | Keep focused on single-user experience, social can come later |

---

## Feature Dependencies

```
JJK Narrator Voice Audio
    └──requires──> Professional Voice Cloning (PVC)
                        └──requires──> High-quality JJK narrator audio samples (15-30+ minutes)

Dramatic JJK-Style Explanations
    └──requires──> Prompt Engineering (narrator persona)
                        └──requires──> LLM API (Claude/GPT)

Text Input
    └──enhances──> Topic-Aware Dramatization
                        └──requires──> Input Analysis/Classification

Audio Playback
    └──enhances──> JJK Aesthetic UI
    └──requires──> Audio Streaming/Download

Share Audio Clips
    └──conflicts──> Unlimited Free Tier (cost issue)
    └──requires──> Audio Generation + Storage
```

### Dependency Notes

- **JJK Narrator Voice requires Professional Voice Cloning:** Instant Voice Cloning (IVC) won't capture the unique dramatic cadence and signature delivery style. PVC trains a dedicated model on JJK narrator audio.
- **Dramatic JJK-Style Explanations require Prompt Engineering:** Must craft prompts that generate slow, dramatic, technique-breakdown style explanations — not just informative responses.
- **Audio Playback enhances JJK Aesthetic UI:** The visual experience complements the authentic audio. Dark theme, Domain Expansion effects, JJK fonts all reinforce the immersion.
- **Share Audio Clips conflicts with Unlimited Free Tier:** Audio generation costs accumulate. Sharing incentivizes more generation, increasing API costs.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the core concept: "JJK fans want dramatic explanations in authentic narrator voice."

- [x] **Text input field** — Core interaction mechanism
- [x] **Audio output with playback controls** — Users listen to narrator explanations
- [x] **JJK-style dramatic explanation generation** — Core value proposition
- [x] **Professional Voice Cloning of JJK narrator** — PRIMARY DIFFERENTIATOR
- [x] **M Dark theme / JJK aesthetic** — Immersive fan experience
- [x] **Loading/response indicator** — User feedback during generation
- [x] **Error handling** — Graceful failure, retry options
- [x] **Mobile responsive design** — Fans use phones

**MVP Rationale:** These 8 features create a complete, delightful core experience. Users can ask questions and receive authentic JJK narrator explanations. Everything else is enhancement.

### Add After Validation (v1.x)

Features to add once core is working and users validate the concept.

| Feature | Trigger for Adding | Priority |
|---------|-------------------|----------|
| Explanation history (session) | Users want to replay previous | P2 |
| Share audio clips | Users asking for social features | P2 |
| Topic-aware dramatization | Feedback that simple topics feel over-dramatized | P2 |
| JJK reference callbacks | Users love the aesthetic, want more | P3 |
| Download audio | Users want offline access | P3 |
| Rate limiting | Costs need management at scale | P2 (or earlier if costs spike) |

### Future Consideration (v2+)

Features to defer until product-market fit is established.

| Feature | Why Defer | Notes |
|---------|-----------|-------|
| User accounts | Not core to entertainment value, adds auth/database complexity | Consider OAuth (Google, Discord) when needed |
| Multi-language | Voice cloning quality issues for non-English, high engineering effort | Focus on English first, proven market |
| Character selection | Different JJK character voices | Premium feature, requires multiple PVC models |
| Social features | Comments, likes, community | Moderation burden, not core value |
| Real-time voice conversation | High latency risk, doubles complexity, requires WebRTC | Stay text→audio for simplicity |

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Text input field | HIGH | LOW | P1 |
| Audio playback controls | HIGH | LOW | P1 |
| JJK narrator voice cloning | CRITICAL | HIGH | P1 |
| Dramatic explanation generation | CRITICAL | MEDIUM | P1 |
| JJK dark theme UI | MEDIUM | LOW | P1 |
| Loading indicators | MEDIUM | LOW | P1 |
| Error handling | MEDIUM | MEDIUM | P1 |
| Mobile responsive | HIGH | LOW | P1 |
| Explanation history | MEDIUM | MEDIUM | P2 |
| Share audio clips | MEDIUM | MEDIUM | P2 |
| Topic-aware dramatization | LOW | MEDIUM | P3 |
| JJK reference callbacks | LOW | LOW | P3 |
| User accounts | MEDIUM | HIGH | v2+ |
| Multi-language | LOW | HIGH | v2+ |
| Character voice selection | MEDIUM | HIGH | v2+ |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | Character.AI | ChatGPT Voice | Synthesia | Our Approach |
|---------|--------------|---------------|-----------|--------------|
| AI-generated content | ✅ Conversational | ✅ Conversational | ✅ Video | ✅ Educational with personality |
| Voice output | ✅ Multiple characters | ✅ Standard voices | ✅ AI avatars | ✅ JJK narrator clone (authentic) |
| Personality/Style | ✅ Character-based | ❌ Neutral | ❌ Corporate | ✅ Entertainment-first, dramatic |
| Mobile app | ✅ Full native app | ✅ Full native | ✅ Web + embeds | ✅ Web responsive (v1), native v2+ |
| User accounts | ✅ Free + Plus | ✅ Free + Pro | ✅ Paid only | ❌ v1: No accounts |
| History | ✅ Chat history | ✅ Chat history | ✅ Project history | ❌ v1: Session only |
| Social features | ✅ Share, community | ❌ | ✅ Share embeds | ❌ v1: No social |
| Educational focus | ❌ General chat | ⚠️ Can explain | ✅ Training videos | ✅ Entertainment-education blend |
| Voice authenticity | ⚠️ Generic character voices | ❌ Standard TTS | ⚠️ AI avatar voices | ✅ Cloned from actual anime |

**Differentiator Summary:** No competitor offers authentic anime narrator voice + JJK-style dramatic explanations + entertainment-first education. This is a unique niche.

---

## Sources

- **ElevenLabs Documentation** — Voice cloning capabilities (Instant vs Professional), API features, expressive mode, pronunciation dictionaries — https://elevenlabs.io/docs
- **Synthesia Platform** — AI video/voice features, interactivity, publishing, analytics — https://synthesia.io/features
- **Anthropic Claude 3.5 Sonnet Announcement** — Artifacts feature, AI content generation patterns — https://anthropic.com/news/claude-3-5-sonnet
- **PROJECT.md** — Project context, out of scope features, target audience (JJK fans seeking entertainment with educational value)

---

## Key Research Findings

### Voice Cloning Technology (ElevenLabs)

**Instant Voice Cloning (IVC):**
- Quick generation from short audio samples
- Relies on prior training data to "guess" voice characteristics
- May not capture unique delivery styles well

**Professional Voice Cloning (PVC):**
- Trains dedicated model on large voice dataset (15-30+ minutes recommended)
- Higher quality, captures unique accent and delivery style
- Takes ~3 hours for English, ~6 hours for multilingual
- **RECOMMENDED for JJK narrator:** Unique dramatic delivery requires PVC

### Entertainment-First Education Patterns

From competitor analysis:
- **Character.AI:** Personality-based AI is popular but lacks educational focus
- **ChatGPT Voice:** Educational but lacks personality/entertainment
- **Synthesia:** Professional focus, not entertainment

**Gap in market:** Entertainment-focused educational AI with authentic character voices.

### Cost Considerations

Voice API costs are real:
- Each audio generation costs money
- PVC requires paid plan (Creator+ tier on ElevenLabs)
- Free tier must be limited to prevent abuse
- Consider rate limiting from v1

---

## Research Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Table stakes features | HIGH | Standard web app patterns, well-documented |
| Voice cloning requirements | HIGH | ElevenLabs docs comprehensive, PVC clearly superior for authentic voice |
| Differentiator features | HIGH | Unique to JJK niche, validated by PROJECT context |
| Anti-features | MEDIUM | Based on product patterns, may need user validation |
| Competitor analysis | MEDIUM | Character.AI/ChatGPT/Synthesia are well-known, but JJK-specific apps minimal |

---

## Open Questions for Phase-Specific Research

1. **Voice cloning quality:** How many JJK narrator audio samples are needed? What's the minimum acceptable quality?
2. **Prompt engineering:** What specific prompt patterns create the JJK narrator style? Need examples of dramatic exposition.
3. **Rate limiting:** What's a reasonable free tier limit before costs spiral?
4. **JJK aesthetic:** What specific visual elements define JJK? Color palette? Fonts? Domain Expansion effects?
5. **Audio storage:** Where to store generated audio? CDN? Direct streaming?

---

## Recommendations for Roadmap

### Phase 1: Core MVP
- Text input + JJK-style prompt engineering
- Audio generation with playback
- Professional Voice Cloning setup
- JJK dark theme UI
- Mobile responsive

### Phase 2: Enhanced Experience
- Session history
- Share functionality
- Topic-aware dramatization
- Rate limiting

### Phase 3: Expand & Monetize
- User accounts (optional)
- Premium features (character selection, unlimited)
- Social features (if validated)

---

*Feature research for: JJK Narrator AI Teacher*
*Researched: 2025-03-30*