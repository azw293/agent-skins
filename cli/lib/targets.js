'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Agent → config file mapping
 * Priority order for auto-detection
 */
const AGENT_TARGETS = {
  claude:   ['CLAUDE.md', '.claude/CLAUDE.md'],
  cursor:   ['.cursor/rules', '.cursorrules'],
  codex:    ['AGENTS.md', 'agents.md'],
  gemini:   ['GEMINI.md', '.gemini/GEMINI.md'],
  windsurf: ['.windsurf/rules', 'WINDSURF.md'],
  raw:      ['skin.md'],   // just write the skin to a standalone file
};

/**
 * Auto-detect which agent config file exists in the current directory.
 * Returns { agent, file } or null if nothing found.
 */
function detectTarget(cwd = process.cwd()) {
  for (const [agent, candidates] of Object.entries(AGENT_TARGETS)) {
    for (const candidate of candidates) {
      if (fs.existsSync(path.join(cwd, candidate))) {
        return { agent, file: candidate };
      }
    }
  }
  // Default: create CLAUDE.md (most common)
  return { agent: 'claude', file: 'CLAUDE.md' };
}

/**
 * Resolve the final target file path given CLI flags
 */
function resolveTarget({ target, agent, global: isGlobal } = {}) {
  if (isGlobal) {
    return path.join(os.homedir(), '.claude', 'CLAUDE.md');
  }
  if (target) {
    return path.resolve(process.cwd(), target);
  }
  if (agent) {
    const candidates = AGENT_TARGETS[agent];
    if (!candidates) {
      throw new Error(`Unknown agent: "${agent}". Supported: ${Object.keys(AGENT_TARGETS).join(', ')}`);
    }
    return path.resolve(process.cwd(), candidates[0]);
  }
  const detected = detectTarget();
  return path.resolve(process.cwd(), detected.file);
}

module.exports = { detectTarget, resolveTarget, AGENT_TARGETS };
