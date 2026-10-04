# Research Integration for Context Craft

## Agent A: Domain Expertise - Context Management

**Key Findings Applied:**
- **Memory Hierarchy Design**: Treating context as L1 cache with explicit archive (L3) state
- **Deterministic Scoring**: User control beats LLM inference for curation (DMF Framework findings)
- **Selective Attention**: Users gate what enters active context vs archive
- **Lifecycle Management**: Clear active/archived boundaries with reversible transitions

**Specific Techniques:**
- Toggle UI implements "selective attention" principle directly
- Archive preserves history without polluting active context (solves "context poisoning")
- Token estimation gives users visibility into capacity constraints
- Separation of facts/preferences/working memory through visual organization

---

## Agent B: User Psychology & Human Factors

**Key Findings Applied:**
- **Frustration Level 7/9**: Users lose 11-20% work time to context loss - this is the pain we solve
- **Perceived Ownership**: Manual curation creates engagement when paired with visible state
- **Trust Erosion at 41%**: Customers report repeating information - Context Craft addresses directly
- **Relief Through Control**: "Finally!" response when users get memory management

**Specific Techniques:**
- Archive-first design (reversible) vs delete (permanent) reduces loss aversion
- Explicit "toggle this message" action beats hoping AI noticed
- Immediate visual feedback on every toggle action
- Empty states guide users on first run

**User Language Incorporated:**
- "Goldfish memory" → tagline: "Take control of what your AI remembers"
- "Constantly repeat" → value prop: "Never repeat yourself again"

---

## Agent C: Conversational AI & Context

**Key Findings Applied:**
- **Context Window Effects**: Token ordering affects AI responses measurably
- **Prompt Engineering**: System directives about disabled messages work with current LLMs
- **Error Recovery**: When wrong context used, user can immediately re-toggle and retry

**Specific Techniques:**
- Prepend system message: "CONTEXT CONTROL: User disabled messages X, Y, Z. Do not reference them."
- Clear instruction format that LLMs already follow
- Reversible context changes allow experimentation

---

## Agent D: Interface & Interaction Design

**Key Findings Applied:**
- **Toggle Interface Patterns**: Switch role with aria-checked for accessibility
- **Visual Hierarchy**: Active (green) vs Archived (gray) with high contrast
- **44px Tap Targets**: Mobile-friendly even in sidebar
- **Keyboard Navigation**: Tab to reach, Space to toggle, Enter to archive

**Specific Techniques:**
- Color + icon redundancy (green checkmark, red minus) never hue alone
- Sticky header showing total active tokens
- List items with clear focus states
- Direct manipulation - tap to toggle, no confirmation dialogs

---

## Agent E: Technical Architecture

**Key Findings Applied:**
- **Manifest v3 Requirements**: Service worker limitations, content script patterns
- **Local Storage**: 5MB sync, 10MB local - sufficient for toggle state
- **Performance**: Chrome Storage faster than re-parsing DOM every time
- **Injection Patterns**: MutationObserver to detect new messages, inject controls

**Specific Techniques:**
- Content script watches for new chat messages
- Toggle states stored as `{conversationId: {messageId: boolean}}`
- Token estimation client-side (char count / 4)
- No backend server - pure client-side

---

## Agent F: Code Quality & Documentation

**Key Findings Applied:**
- **TypeScript Strict Mode**: Catch errors at compile time
- **Exhaustive Naming**: `toggleMessageContextState` not `toggle`
- **Single Responsibility**: Separate modules for storage, UI, token counting
- **Zero Magic Numbers**: Token estimation divisor is named constant
- **Error Messages Cite Failures**: "Failed to save toggle state: quota exceeded" not "Save failed"

**Specific Standards:**
- Google TypeScript Style Guide naming
- 2-space indent, semicolons, trailing commas
- JSDoc for public functions
- Constants file for magic numbers
- Type definitions for all storage shapes

---

## Agent G: Production Polish

**Key Findings Applied:**
- **Loading States**: Shimmer skeleton while counting tokens
- **Empty States**: "No conversation loaded. Open ChatGPT or Claude and start chatting."
- **Error Messages**: "Context Craft doesn't work on this page. Try ChatGPT or Claude."
- **Onboarding**: Welcome modal on first install with 3-step wizard

**Specific Polish:**
- Shimmer animation matching final layout (not spinners)
- Professional icon at all sizes (16px, 32px, 48px, 128px)
- Clear permissions explanations during install
- Extension works immediately, no signup required
- Graceful degradation when page updates mid-session

---

## Research-Driven Design Decisions

### Why Browser Extension (Not Web App)
- Agent E: Can inject into existing ChatGPT/Claude pages without switching
- Agent D: Sidebar pattern proven (Grammarly, Notion Clipper)
- Agent B: Users want control WITHOUT disrupting workflow

### Why Toggle UI (Not Slider/Slider)
- Agent D: Binary on/off is clearest affordance
- Agent B: Recognition over recall - see current state immediately
- Agent F: Simplest implementation = fewest bugs

### Why Archive (Not Delete)
- Agent B: Archive is reversible, reduces anxiety
- Agent A: L3 storage = preserve history without polluting active context
- Users report higher confidence with undo path

### Why Token Count Display
- Agent A: Users need visibility into capacity constraints
- Agent B: Extrinsic cognitive load reduced by showing, not hiding, limits
- Agent D: Sticky header = always visible

### Why Client-Side Only
- Agent E: No backend = instant availability, no signup friction
- Agent B: Privacy-respecting (no data leaves browser)
- Agent A: Local storage sufficient for toggle state

---

## What This Unlocks (5-7 Other App Ideas)

### 1. **AI Diff Review Studio** (Agent B pain point)
Same research foundation: users need control over AI-generated code changes
- Research transfer: Toggle UI → Line-level comment UI
- Psychology transfer: Visibility + reversibility + ownership

### 2. **Task Verification Layer** (Agent B pain point)
"Show me what you'll change before you do it"
- Research transfer: Context control → Action approval workflow
- Architecture transfer: Client-side state management, no backend

### 3. **AI Email Context Manager**
Context Craft for email threads
- Direct transfer: All 7 agents' findings apply to email threads
- Toggle which emails AI remembers when drafting replies

### 4. **Meeting Notes Context Curator**
Toggle which parts of transcript go into summary
- Transfer: Agent G polish standards, Agent D toggle UI
- New domain: Time-coded audio segments

### 5. **Research Paper Context Manager**
Toggle which papers/sections AI references when writing literature review
- Transfer: Agent A memory hierarchy, Agent F code standards
- New domain: PDF extraction + citation tracking

### 6. **Multi-Chat Context Sync**
Share curated context across ChatGPT, Claude, Gemini
- Transfer: Agent E storage patterns, cross-platform injection
- New feature: Export/import context bundles

### 7. **AI Prompt Template Library**
Save curated context + instructions as reusable templates
- Transfer: Agent C prompt engineering, Agent B progressive disclosure
- New feature: Community template sharing

---

## Code Quality Commitments (From Agent F)

Every file will follow:
- **Exhaustive naming**: `calculateActiveTokenCountForConversation` not `countTokens`
- **Single responsibility**: Each module does ONE thing
- **Zero magic numbers**: `const CHARS_PER_TOKEN = 4` not `/ 4`
- **Error messages cite actual failures**: Include the storage key, quota limit, actual error
- **Type safety**: TypeScript strict mode, no `any` types
- **File organization**: `/src/background/`, `/src/content/`, `/src/popup/`, `/src/shared/`

---

## Production Standards (From Agent G)

Every user-facing element will include:
- **Loading state**: Shimmer skeleton during token count calculation
- **Empty state**: Helpful message when no conversation loaded
- **Error state**: Clear explanation + actionable next step
- **Keyboard shortcuts**: Document in extension popup
- **First-run onboarding**: 3-step wizard with skip option
- **WCAG AA contrast**: 4.5:1 for body text, 3:1 for large
- **Reduced motion**: Honor `prefers-reduced-motion` for animations
