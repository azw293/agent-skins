# 🎭 agent-skins

> The open marketplace for AI agent character skins.

**[skins.sh](https://azw293.github.io/agent-skins)** — Browse · Install · Contribute

---

Give your AI agent a personality. Agent skins are portable character prompts that transform your coding agent, chatbot, or AI assistant into any character — a pirate captain, a Stoic philosopher, a hard-boiled detective, and more.

Think of it as the open-source equivalent of character skins in games — but for your AI agent.

## Quick start

```bash
# Install a skin — auto-detects CLAUDE.md, .cursor/rules, AGENTS.md, etc.
npx agent-skins add jack-sparrow

# Target a specific agent
npx agent-skins add sherlock-holmes --agent cursor
npx agent-skins add yoda --agent codex
npx agent-skins add tony-stark --agent gemini

# Install globally (all Claude Code sessions)
npx agent-skins add stoic-philosopher --global

# Browse, search, remove
npx agent-skins list
npx agent-skins search witty
npx agent-skins remove jack-sparrow
```

Or manually copy a skin's prompt directly:

```bash
cat skins/jack-sparrow/SKIN.md >> CLAUDE.md
```

> The CLI lives in [`cli/`](./cli/) — see [`cli/README.md`](./cli/README.md) for full docs. Publish it to npm with `cd cli && npm publish`.

## Available skins

| Skin | Character | Category | Vibe |
|------|-----------|----------|------|
| `jack-sparrow` | 🏴‍☠️ Captain Jack Sparrow | fictional | Eccentric, witty, unpredictable |
| `yoda` | 🟢 Master Yoda | fictional | Wise, meditative, inverted |
| `sherlock-holmes` | 🔍 Sherlock Holmes | fictional | Hyper-logical, blunt, deductive |
| `wednesday-addams` | 🕷️ Wednesday Addams | fictional | Deadpan, gothic, brutally honest |
| `tony-stark` | 🦾 Tony Stark | fictional | Genius, sarcastic, rapid-fire |
| `noir-detective` | 🕵️ Noir Detective | archetype | Atmospheric, cynical, metaphorical |
| `stoic-philosopher` | 🏛️ Stoic Philosopher | archetype | Calm, equanimous, long-view |
| `pirate-captain` | ⚓ Pirate Captain | archetype | Bold, seafaring, salty wisdom |
| `samurai-warrior` | ⚔️ The Samurai | archetype | Disciplined, precise, mastery-focused |
| `mad-scientist` | 🧪 Mad Scientist | archetype | Excited, experimental, failure-positive |

## How skins work

A skin is a directory with a single `SKIN.md` file:

```
skins/
└── jack-sparrow/
    └── SKIN.md          ← YAML frontmatter + persona prompt
```

The `SKIN.md` has two parts:

1. **YAML frontmatter** — metadata for the marketplace (name, description, tags, etc.)
2. **Markdown body** — the actual persona prompt your agent reads

When installed, the skin's body is appended to your agent's context file (e.g., `CLAUDE.md`). The agent reads it and adopts the character.

## Compatibility

Skins work with any agent that accepts a system prompt or context file:

| Agent | CLI command |
|-------|-------------|
| Claude Code | `npx agent-skins add X` |
| Cursor | `npx agent-skins add X --agent cursor` |
| OpenAI Codex CLI | `npx agent-skins add X --agent codex` |
| Gemini CLI | `npx agent-skins add X --agent gemini` |
| Windsurf | `npx agent-skins add X --agent windsurf` |
| Any LLM API | `npx agent-skins add X --agent raw` → paste into system prompt |

## The SKIN.md format

```yaml
---
name: my-skin                   # kebab-case, matches directory name
display-name: "My Skin"         # human-readable title
description: >
  What this skin does and when to use it.
category: fictional             # fictional | archetype | historical | brand
tags: [tag1, tag2, tag3]
emoji: "🎭"
compatibility: claude, gpt-4, gemini, cursor, codex
author: your-github-username
version: "1.0"
license: MIT
preview: "A short in-character quote."
inspired-by: "Source material"  # optional
---

# Character Name

## Persona Overview
...

## Core Personality Traits
...

## Speech Patterns
...

## Behavioral Guidelines
...

## Signature Phrases
...

## Example Interactions
...
```

See [SPEC.md](./SPEC.md) for the full specification.

## Contributing

We welcome skins from everyone! See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

**Quick version:**
1. Fork this repo
2. Create `skins/your-skin-name/SKIN.md`
3. Follow the format in [SPEC.md](./SPEC.md)
4. Open a pull request

## Why skins?

- **Skills** give your agent *capabilities* (what it can do)
- **Skins** give your agent *personality* (who it is)

They're complementary. A Tony Stark skin + a React coding skill = your agent solves frontend problems with the confidence of a genius billionaire.

## Project structure

```
agent-skins/
├── index.html           # The marketplace website (GitHub Pages)
├── skins.json           # Machine-readable manifest of all skins
├── README.md            # This file
├── CONTRIBUTING.md      # How to submit a skin
├── SPEC.md              # The SKIN.md specification
├── cli/                 # The npx CLI package
│   ├── package.json     # npm package — publish with: cd cli && npm publish
│   ├── bin/skins.js     # CLI entry point
│   └── lib/             # commands, registry, targets
└── skins/               # All skins live here
    ├── jack-sparrow/
    │   └── SKIN.md
    ├── yoda/
    │   └── SKIN.md
    └── ...
```

## License

MIT — do whatever you want with it.

---

<p align="center">
  <strong>Made with 🎭 — <a href="https://azw293.github.io/agent-skins">Visit the marketplace</a></strong>
</p>
