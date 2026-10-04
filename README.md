# Context Craft - AI Context Manager

Browser extension that gives you manual control over AI conversation context.

## The Problem

AI assistants lose context mid-conversation, forget important instructions, and mix up details. Users lose 11-20% of work time constantly repeating themselves.

- 50+ mentions across Reddit/HN with frustrated language: "goldfish memory", "constantly repeat"
- 41% of users report repeating information to AI
- Quote: "I wish every instruction and response had a enable/disable checkbox"

## The Solution

Context Craft is a browser extension that adds a sidebar to ChatGPT and Claude showing every message in your conversation. Toggle individual messages on or off to control what the AI remembers.

### Features

- **Toggle Context**: Enable/disable any message for AI's context
- **Archive Old Messages**: Move outdated content out of context, keep for reference
- **Token Visibility**: See estimated active token count
- **Reversible Changes**: Archive is reversible, not permanent deletion

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this directory
5. Open ChatGPT or Claude - the sidebar appears automatically

## Technical Stack

- Manifest v3 browser extension
- Pure client-side (no backend server)
- Local storage for toggle states
- Works with ChatGPT and Claude web interfaces

## Research-Backed Design

Built on findings from 7 domain experts across:
- Context management & knowledge architecture
- User psychology & human factors
- Conversational AI patterns
- Interface design & accessibility
- Technical architecture for extensions
- Code quality standards
- Production polish requirements

See `RESEARCH.md` for full research integration.

## What This Unlocks

The same research foundation enables:
- AI Code Review Studio (line-level comments on generated code)
- Task Verification Layer (preview changes before execution)
- Email Context Manager (toggle emails in AI replies)
- Meeting Notes Curator (toggle transcript segments)
- Research Paper Manager (toggle papers in literature reviews)

## License

MIT

## Build-a-Day Project

Built October 4, 2026 as part of the Build-a-Day initiative - identifying AI market gaps through research and building products to fill them.
