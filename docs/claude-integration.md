# Integrating skins with Claude Code

This guide explains exactly how to integrate agent skins with Claude Code — mirroring how skills work.

---

## How skills work (the pattern we mirror)

When Claude Code starts in a project, it reads `CLAUDE.md` in your project root. Skills work by placing a `SKILL.md` file in a folder structure that CLAUDE.md references — Claude reads it and gains the skill's capabilities.

Skins use the **exact same pattern**.

---

## Method 1: Append to CLAUDE.md (simplest, most compatible)

The most reliable way. The skin's persona prompt is appended directly to your `CLAUDE.md` — Claude reads it as part of its context for the entire session.

```bash
# Using the install script
./install.sh jack-sparrow

# Or manually
cat skins/jack-sparrow/SKIN.md >> CLAUDE.md
```

Your `CLAUDE.md` ends up looking like:
```markdown
# My Project

[your existing project instructions]

---
# Skin: jack-sparrow
---
name: jack-sparrow
display-name: "Captain Jack Sparrow"
...
---

# Captain Jack Sparrow
...
[full persona prompt]
```

---

## Method 2: .claude/skins/ folder (mirrors .claude/skills/)

This mirrors the skills folder pattern exactly. Add a skin to `.claude/skins/` and reference it from `CLAUDE.md`.

**Folder structure:**
```
your-project/
├── CLAUDE.md
└── .claude/
    ├── skills/                      ← your skills go here
    │   └── react/SKILL.md
    └── skins/                       ← skins go here
        └── jack-sparrow/SKIN.md
```

**Install to the project skins folder:**
```bash
mkdir -p .claude/skins/jack-sparrow
cp ~/.agent-skins/skins/jack-sparrow/SKIN.md .claude/skins/jack-sparrow/
```

**Reference it from CLAUDE.md:**
```markdown
# My Project

## Active skin
The character skin for this project is defined in .claude/skins/jack-sparrow/SKIN.md.
Please read and apply that skin for all responses.
```

Or add the full contents inline using:
```bash
cat .claude/skins/jack-sparrow/SKIN.md >> CLAUDE.md
```

---

## Method 3: Global skin (applies to all Claude Code sessions)

Install a skin globally so it applies across all your projects — like a global skill.

```bash
# Install globally
./install.sh yoda --global

# This places it at:
# ~/.claude/skins/yoda/SKIN.md
```

Then reference it in your global `~/.claude/CLAUDE.md`:
```bash
cat ~/.claude/skins/yoda/SKIN.md >> ~/.claude/CLAUDE.md
```

---

## Method 4: Per-project with .skins file (lightweight)

For quick project-level skin selection without modifying CLAUDE.md, create a `.skins` file:

```bash
# .skins (in project root)
jack-sparrow
```

Then add a single line to CLAUDE.md pointing to the skins directory:
```markdown
<!-- Load skin from .skins file -->
Apply the character skin specified in .skins file from the ~/.agent-skins/skins/ directory.
```

---

## Switching skins

To switch from one skin to another, replace the skin block in your CLAUDE.md:

```bash
# Remove old skin (manual — find the --- # Skin: block and delete it)
# Then install the new one:
./install.sh sherlock-holmes
```

Or use the interactive selector (coming soon):
```bash
npx skins use
# → opens interactive skin picker
```

---

## Using skins with other agents

| Agent | How to apply the skin |
|-------|----------------------|
| **Claude Code** | Append to `CLAUDE.md` in project root |
| **Cursor** | Append to `.cursor/rules` |
| **Codex CLI** | Append to `AGENTS.md` |
| **Gemini CLI** | Append to `GEMINI.md` |
| **Any LLM API** | Paste skin body into your `system` message |
| **OpenAI Assistants** | Paste skin body into the system instructions field |

---

## Combining skins and skills

Skins and skills are designed to compose. Use both:

```bash
# Install a skill (capability)
npx skills add react-expert

# Install a skin (personality)
./install.sh tony-stark
```

Your CLAUDE.md then has both — Tony Stark who is an expert React developer. The skill tells him *what* to do; the skin tells him *how* to be while doing it.

---

## Tips

**One skin at a time** — Multiple skins in the same file will conflict. Pick one per project.

**Skins work best with short context** — If your CLAUDE.md is already very long, add the skin at the top so it's read early.

**Test immediately** — After installing, ask your agent a simple question. The character should come through in the first response.

**Skin + persona consistency** — Claude will maintain the character more consistently if the skin is in CLAUDE.md than if it's only in a referenced file.
