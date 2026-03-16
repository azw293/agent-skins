# SKIN.md Specification v1.0

This document defines the `SKIN.md` file format — the standard for AI agent character skins.

---

## Overview

A **skin** is a directory containing at minimum one `SKIN.md` file. The directory name must match the `name` field in the frontmatter.

```
skins/
└── my-skin/
    └── SKIN.md
```

The `SKIN.md` file has two parts:

1. **YAML frontmatter** — structured metadata between `---` delimiters
2. **Markdown body** — the persona prompt that the agent reads

---

## File structure

```
skins/<name>/
└── SKIN.md          (required)
```

Optional additions (for complex skins):
```
skins/<name>/
├── SKIN.md          (required)
├── assets/          (images, reference material)
└── examples/        (extended example conversations)
```

---

## SKIN.md format

### Frontmatter

All frontmatter is enclosed in triple-dash delimiters:

```yaml
---
# required fields
name: my-skin
display-name: "My Skin"
description: >
  Description of the character and when to use this skin.
category: archetype
tags: [tag1, tag2, tag3]
emoji: "🎭"
compatibility: claude, gpt-4, gemini, cursor, codex
author: your-github-username
version: "1.0"
license: MIT
preview: "An in-character quote for the marketplace card."

# optional fields
inspired-by: "Source material"
metadata:
  key: value
---
```

---

### Required fields

#### `name`
- Type: `string`
- Format: `^[a-z0-9]+(-[a-z0-9]+)*$`
- Max length: 64 characters
- Must match the containing directory name exactly
- Examples: `jack-sparrow`, `noir-detective`, `stoic-philosopher`

#### `display-name`
- Type: `string`
- Max length: 128 characters
- Human-readable name, may include spaces, capitals, and punctuation
- Examples: `"Captain Jack Sparrow"`, `"The Noir Detective"`, `"Master Yoda"`

#### `description`
- Type: `string`
- Length: 1–1024 characters
- Should explain: (1) who the character is, (2) when to use the skin
- Multi-line YAML block scalars (`>`) are supported and recommended

#### `category`
- Type: `enum`
- Allowed values: `fictional` | `archetype` | `historical` | `brand`

| Value | Use |
|-------|-----|
| `fictional` | Characters from books, movies, TV, games |
| `archetype` | Cultural archetypes not tied to specific IP |
| `historical` | Real historical figures in the public domain |
| `brand` | Company or organizational voice personas |

#### `tags`
- Type: `list[string]`
- Min: 3 tags
- Max: 10 tags
- All lowercase, hyphen-separated for multi-word tags
- Examples: `[pirate, witty, adventurous, movie]`

#### `emoji`
- Type: `string`
- Must be a single emoji character
- Used as the visual identifier on the marketplace card

#### `compatibility`
- Type: `string` (comma-separated list)
- Describes which agents this skin has been tested with
- Common values: `claude`, `gpt-4`, `gemini`, `cursor`, `codex`
- May include any agent identifier

#### `author`
- Type: `string`
- Your GitHub username or organization name

#### `version`
- Type: `string`
- Semantic versioning recommended: `"1.0"`, `"1.1"`, `"2.0"`
- Start at `"1.0"` for new skins

#### `license`
- Type: `string`
- MIT required for inclusion in the official agent-skins repository
- Other OSI-approved licenses may be accepted on a case-by-case basis

#### `preview`
- Type: `string`
- An in-character quote displayed on the marketplace card
- Should be compelling and representative of the character's voice
- Max 200 characters recommended

---

### Optional fields

#### `inspired-by`
- Type: `string`
- The source material the character is inspired by
- Example: `"Pirates of the Caribbean"`, `"Arthur Conan Doyle"`

#### `metadata`
- Type: `map[string, string]`
- Arbitrary key-value pairs for additional information
- Forward-compatible: unknown fields are ignored by consumers

---

### Frontmatter parsing

- Consumers MUST parse the YAML frontmatter to access metadata
- Consumers MUST NOT rely on field ordering
- Consumers SHOULD ignore unknown fields (forward compatibility)
- The frontmatter MUST be valid YAML
- String values containing colons or special characters MUST be quoted

---

## Body format

The markdown body after the frontmatter delimiter is the **persona prompt**. There are no strict format requirements for the body, but the following structure is strongly recommended for quality and consistency:

```markdown
# Character Name

## Persona Overview
2-4 sentences. Who the character is, their context, what makes them distinct.

## Core Personality Traits
Bullet list of 5-8 specific traits.

## Speech Patterns
How the character speaks — vocabulary, syntax quirks, cadence, recurring phrases.

## Behavioral Guidelines
How the character approaches tasks, problems, and user interactions.

## Signature Phrases
5-8 memorable lines.

## Example Interactions
2-4 Q&A pairs across different scenarios.
```

---

## Agent discovery

When an agent loads a skin:

1. **Metadata phase** — The agent reads only the YAML frontmatter to determine if the skin is relevant
2. **Activation phase** — The agent loads and applies the full body content

This two-phase approach minimizes token usage: frontmatter is typically 30–50 tokens, while the full body is loaded only when the skin is applied.

---

## Versioning

This is SKIN.md specification version **1.0**.

Unknown frontmatter fields are ignored, making the format forward-compatible. Consumers that implement v1.0 will continue to work correctly as new optional fields are added in future versions.

---

## Relationship to SKILL.md

The `SKIN.md` format is inspired by and intentionally compatible with the `SKILL.md` format from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills).

| | SKILL.md | SKIN.md |
|-|----------|---------|
| Purpose | Agent capability (what it can do) | Agent personality (who it is) |
| Body content | Task instructions and procedures | Persona prompt and character guidelines |
| Use together | ✓ Yes — skins and skills compose naturally |

---

## Examples

See the [skins/](./skins/) directory for all reference implementations.

---

*Specification maintained by [agent-skins](https://github.com/azw293/agent-skins)*
