'use strict';

// Public API (for use as a library, not just CLI)
const { fetchManifest, fetchSkinContent, parseSkin } = require('./registry');
const { resolveTarget, detectTarget, AGENT_TARGETS } = require('./targets');
const { add, list, remove, info, search } = require('./commands');

module.exports = {
  // Registry
  fetchManifest,
  fetchSkinContent,
  parseSkin,
  // Targets
  resolveTarget,
  detectTarget,
  AGENT_TARGETS,
  // Commands
  add,
  list,
  remove,
  info,
  search,
};
