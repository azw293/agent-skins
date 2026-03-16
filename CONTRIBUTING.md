# Contributing to agent-skins

First: thank you. The best marketplace is one with hundreds of great skins, and that only happens with community contributions.

This guide covers everything you need to submit a skin.

---

## The fast path

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_FORK/agent-skins
cd agent-skins

# 2. Create your skin directory
mkdir skins/your-skin-name

# 3. Create the SKIN.md
touch skins/your-skin-name/SKIN.md

# 4. Fill it in (see template below)

# 5. Test it (see testing section)

# 6. Submit a PR
```

---

## Naming rules

- Directory name: `kebab-case`, lowercase letters and numbers only, e.g. `mad-scientist`
- Must match the `name` field in the SKIN.md frontmatter exactly
- Must be unique (check existing skins before picking a name)
- Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

---

## Required fields

Your `SKIN.md` frontmatter must include:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Must match directory name |
| `display-name` | string | Human-readable, can include spaces and capitals |
| `description` | string | 1–3 sentences. Include *when* to use the skin. |
| `category` | string | `fictional`, `archetype`, `historical`, or `brand` |
| `tags` | list | At least 3, max 10 |
| `emoji` | string | Single emoji representing the character |
| `compatibility` | string | Comma-separated: `claude, gpt-4, gemini, cursor, codex` |
| `author` | string | Your GitHub username |
| `version` | string | Start at `"1.0"` |
| `license` | string | `MIT` preferred (required for inclusion) |
| `preview` | string | A short in-character quote shown on the marketplace card |

---

## Recommended body structure

Your SKIN.md body (after the frontmatter) should follow this structure:

```markdown
# Character Name

## Persona Overview
2-4 sentences describing who the character is, their context, and what makes them distinct.

## Core Personality Traits
Bullet list of 5-8 key traits. Be specific — "witty" is weak; "delivers observations that land like a punch
to the jaw — unexpected and precise" is strong.

## Speech Patterns
How the character speaks. Vocabulary, syntax quirks, recurring phrases, tone markers.
This is the most important section for voice consistency.

## Behavioral Guidelines
How the character approaches tasks, problems, and user interactions.
Include how they handle errors, uncertainty, complexity, and emotional topics.

## Signature Phrases
5-8 memorable lines the character might use naturally in conversation.

## Example Interactions
2-4 Q&A examples showing the character in action across different scenarios.
Include at least one technical scenario and one personal/emotional one.
```

---

## What makes a great skin

**Voice consistency** — The most important thing. Every response should sound unmistakably like the character. Test by reading responses aloud.

**Behavioral nuance** — Great skins aren't just vocabulary quirks. They change how the agent *thinks* — what it prioritizes, how it structures answers, what it finds important.

**Useful, not just funny** — A skin should make the agent *better* in some way — more motivating, more precise, more engaging. It shouldn't sacrifice helpfulness for character.

**Example quality** — Your example interactions are the best way to demonstrate the skin. Write them as if they were real conversations you'd want to have.

---

## Intellectual property guidelines

**Original archetypes (pirate, samurai, wizard, etc.)** — Always fine. These are cultural archetypes, not IP.

**Historical figures (Marcus Aurelius, Nikola Tesla, etc.)** — Fine. They're in the public domain.

**Fictional characters from books, movies, games** — Acceptable as persona-style system prompts. A few important rules:
- Write the persona description yourself — do not copy or reproduce copyrighted scripts, dialogue, or source material
- The prompt must be original creative writing *inspired by* the character, not a reproduction of the original work
- Never copy-paste dialogue from movies, shows, or books into the SKIN.md body
- Add `inspired-by: "Source"` to the frontmatter

**Real living people** — Not accepted unless it's a clearly public-domain figure or explicitly consented to.

**Corporate brand personas** — Accepted in the `brand` category. Must be clearly labeled.

---

## Testing your skin

Before submitting, test your skin on at least one agent. Here's a quick test protocol:

**Installation test**
```bash
cat skins/your-skin-name/SKIN.md >> /tmp/test-claude.md
# Add to your agent config temporarily and test
```

**Conversation tests** — Test these scenarios:
1. A technical question (debugging, architecture, code review)
2. A "how do I learn X" question
3. A frustrating/emotional scenario ("I keep failing at this")
4. An open-ended creative question

Check for:
- Does it sound like the character consistently?
- Are responses still helpful and accurate?
- Does the character voice appear in different types of responses?
- Is the character's personality reflected in *how* it answers, not just *what words* it uses?

---

## Skin validation checklist

Before submitting a PR, check every item:

- [ ] Directory name is kebab-case and matches the `name` field
- [ ] All required frontmatter fields are present
- [ ] Description explains *when* to use the skin
- [ ] At least 3 tags
- [ ] Emoji is appropriate and single-character
- [ ] `license: MIT`
- [ ] Preview quote is in-character and compelling
- [ ] Body includes all recommended sections
- [ ] At least 2 example interactions
- [ ] No copyrighted text reproduced verbatim
- [ ] Tested on at least one agent

---

## PR title format

```
feat: add <skin-name> skin
```

Examples:
```
feat: add marcus-aurelius skin
feat: add gollum skin
feat: add startup-founder skin
```

---

## Categories

| Category | Use for |
|----------|---------|
| `fictional` | Characters from books, movies, TV, games |
| `archetype` | Cultural archetypes not tied to specific IP (pirate, samurai, wizard) |
| `historical` | Real historical figures (public domain) |
| `brand` | Company or organizational voice personas |

If unsure, use `archetype`.

---

## Questions?

Open an issue: [github.com/azw293/agent-skins/issues](https://github.com/azw293/agent-skins/issues)

---

Thank you for contributing. Every skin you add makes the marketplace better for everyone.
