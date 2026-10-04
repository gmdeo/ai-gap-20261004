# Selected Gap: AI Context Manager

## Rationale

**Why this gap over the others:**

1. **Highest demand signal**: 50+ explicit mentions, 15+ dedicated threads, users using consistent frustrated language ("goldfish memory", "constantly repeat")

2. **Most buildable in one day**: Pure UX layer - no AI training, no complex integrations, no regulatory concerns. Browser extension + simple UI.

3. **Immediate utility**: Solves pain users feel *every single conversation*. ROI visible in first 5 minutes of use.

4. **Cross-platform need**: Every AI assistant has this problem. ChatGPT, Claude, Gemini, Copilot - all lose context. Tool works for all of them.

5. **AI-native problem**: This gap only exists because AI assistants exist. It's not "X but with AI" - it's "AI creates new problem, we solve it."

---

## Product Concept

**Name:** Context Craft

**Tagline:** Take control of what your AI remembers

**Core Experience:**
User is working on a coding project with Claude. After 20 exchanges, they've fixed multiple bugs and improved the design. But the conversation now contains:
- Early broken code they don't want AI to reference
- Old architectural ideas they rejected
- Instructions that made sense 2 hours ago but not now

**Without Context Craft:**
Claude starts suggesting the old broken approach because it's still in context. User has to repeatedly say "no, we already fixed that" or start a fresh conversation (losing all the good context).

**With Context Craft:**
User opens Context Craft sidebar. They see the 20 exchanges as a list. They toggle OFF the messages containing old code and outdated ideas. Next Claude response reflects only the curated context - the AI "remembers" exactly what the user wants it to remember.

---

## MVP Feature Set (One-Day Scope)

**Core Features:**
1. **Conversation List View** - See all messages in current chat
2. **Toggle Context** - Enable/disable any message for AI's context
3. **Archive Section** - Move old exchanges out of context but keep for reference
4. **Context Summary** - Show total tokens currently "active" (estimated)

**Technical Approach:**
- Browser extension (Chrome/Firefox)
- Detects ChatGPT/Claude/Gemini web interfaces
- Injects UI panel into the page
- Stores toggle states in browser local storage
- On submit, reads toggle states and prepends a system message like: "CONTEXT CONTROL: The user has disabled messages 3, 7, 11-14 from your context. Do not reference or recall information from those messages."

**What's Simplified/Mocked:**
- Not actually intercepting API calls (would require proxy)
- Relies on AI following "ignore these messages" instruction
- Token counting is estimated (character count / 4)
- No cross-device sync (local storage only)
- No export/import of context states

---

## Why This Works

**Addresses the research findings:**
- **Delegation framing**: "Take control" not "help you control" ✓
- **Prosumer wedge**: Individual users, no enterprise license needed ✓
- **Demonstrable ROI**: Works in first session ✓
- **AI-native**: Only exists because LLMs exist ✓
- **Missing middle**: High-frequency task (every AI conversation) with low AI tool support ✓

**What makes it different:**
- Not another chatbot
- Not a "wrapper" around GPT
- Solves a problem AI companies *won't* solve (they want long conversations for more API revenue)
- Puts user in control of previously automatic/opaque process

---

## Success Metrics

**MVP Success = Evidence this is real:**
- Can toggle messages on/off in live conversation
- AI behavior changes based on toggled context (tested)
- Works with ChatGPT and Claude web interfaces
- Deployed to public URL with demo video

**Doesn't need to prove:**
- Perfect token accounting
- Cross-device sync
- Export/backup
- Multi-chat management
- Integration with all LLM platforms

If the MVP shows the core idea works, those features are obvious next steps.
