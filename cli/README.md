# agent-skins CLI

The official CLI for [skins.sh](https://azw293.github.io/agent-skins) — give your AI agent a personality.

## Install & usage

No install required. Use with `npx`:

```bash
npx agent-skins add jack-sparrow
```

Or install globally once:

```bash
npm install -g agent-skins
skins add jack-sparrow
```

## Commands

### `skins add <name>`

Installs a skin into your project. Auto-detects the right config file based on what's in your directory.

```bash
# Auto-detect (finds CLAUDE.md, .cursor/rules, AGENTS.md, etc.)
npx agent-skins add jack-sparrow

# Target a specific agent
npx agent-skins add sherlock-holmes --agent cursor
npx agent-skins add yoda --agent codex
npx agent-skins add tony-stark --agent gemini

# Specify the file directly
npx agent-skins add noir-detective --target path/to/CLAUDE.md

# Install globally (applies to all Claude Code sessions)
npx agent-skins add stoic-philosopher --global

# Preview without making changes
npx agent-skins add mad-scientist --dry-run
```

**Supported `--agent` values:**

| Value | Writes to |
|-------|-----------|
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursor/rules` |
| `codex` | `AGENTS.md` |
| `gemini` | `GEMINI.md` |
| `windsurf` | `.windsurf/rules` |
| `raw` | `skin.md` (standalone) |

### `skins list`

Browse all available skins.

```bash
npx agent-skins list

# Filter by category
npx agent-skins list --category fictional
npx agent-skins list --category archetype
```

### `skins info <name>`

Show full details about a skin before installing.

```bash
npx agent-skins info wednesday-addams
```

### `skins search <query>`

Search skins by name, tag, or description.

```bash
npx agent-skins search witty
npx agent-skins search detective
npx agent-skins search calm
```

### `skins remove <name>`

Remove an installed skin from your config file.

```bash
npx agent-skins remove jack-sparrow

# Remove from a specific file
npx agent-skins remove jack-sparrow --target CLAUDE.md
```

## How it works

1. `skins add <name>` fetches the `SKIN.md` from the GitHub registry
2. It auto-detects your agent config file (`CLAUDE.md`, `.cursor/rules`, etc.)
3. It wraps the skin content in HTML comment markers for clean install/remove:
   ```
   <!-- skins:start:jack-sparrow -->
   [skin persona prompt]
   <!-- skins:end:jack-sparrow -->
   ```
4. Your agent reads the persona on next session start

## Publishing to npm

The CLI lives in the `cli/` folder of the [agent-skins repo](https://github.com/azw293/agent-skins).

```bash
cd cli
npm publish
```

Once published, users can run `npx agent-skins add <skin>` and it fetches skins live from the GitHub registry — no local install of the skins themselves needed.
