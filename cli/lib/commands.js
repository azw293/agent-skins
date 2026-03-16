'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { fetchManifest, fetchSkinContent, parseSkin } = require('./registry');
const { resolveTarget, detectTarget } = require('./targets');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function parseFlags(args) {
  const flags = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      flags._.push(args[i]);
    }
  }
  return flags;
}

const SKIN_MARKER_START = (name) => `<!-- skins:start:${name} -->`;
const SKIN_MARKER_END   = (name) => `<!-- skins:end:${name} -->`;

function isSkinInstalled(content, skinName) {
  return content.includes(SKIN_MARKER_START(skinName));
}

// Returns array of all skin names currently installed in the file
function getInstalledSkins(content) {
  const re = /<!-- skins:start:([\w-]+) -->/g;
  const found = [];
  let match;
  while ((match = re.exec(content)) !== null) {
    found.push(match[1]);
  }
  return found;
}

function wrapSkin(skinContent, skinName) {
  return `\n${SKIN_MARKER_START(skinName)}\n${skinContent}\n${SKIN_MARKER_END(skinName)}\n`;
}

function removeSkinBlock(content, skinName) {
  const re = new RegExp(
    `\\n?${escapeRe(SKIN_MARKER_START(skinName))}[\\s\\S]*?${escapeRe(SKIN_MARKER_END(skinName))}\\n?`,
    'g'
  );
  return content.replace(re, '\n');
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Colored output (no deps)
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
};

const log = {
  info:    (msg) => console.log(`  ${c.blue}ℹ${c.reset}  ${msg}`),
  success: (msg) => console.log(`  ${c.green}✓${c.reset}  ${msg}`),
  warn:    (msg) => console.log(`  ${c.yellow}⚠${c.reset}  ${msg}`),
  error:   (msg) => console.error(`  ${c.red}✖${c.reset}  ${msg}`),
  blank:   ()    => console.log(''),
  raw:     (msg) => console.log(msg),
};

// ─────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────

/**
 * skins add <skin-name> [flags]
 */
async function add(args) {
  const flags = parseFlags(args);
  const skinName = flags._[0];

  if (!skinName) {
    throw new Error('Please specify a skin name. Example: npx agent-skins add jack-sparrow');
  }

  // Resolve target file
  const targetFile = resolveTarget({
    target: flags.target,
    agent:  flags.agent,
    global: flags.global,
  });

  log.blank();
  log.info(`Fetching skin ${c.bold}${skinName}${c.reset} from registry...`);

  // Fetch skin content from GitHub
  const skinContent = await fetchSkinContent(skinName);
  const { meta } = parseSkin(skinContent);

  // Check for dry run
  if (flags['dry-run']) {
    log.blank();
    log.info(`${c.bold}Dry run${c.reset} — no files will be modified`);
    log.blank();
    console.log(skinContent.slice(0, 600) + (skinContent.length > 600 ? '\n...' : ''));
    log.blank();
    log.info(`Would install to: ${c.cyan}${targetFile}${c.reset}`);
    log.blank();
    return;
  }

  // Read existing target file (or empty string)
  ensureDir(targetFile);
  const existing = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf8') : '';

  // Check if this exact skin is already installed
  if (isSkinInstalled(existing, skinName)) {
    log.warn(`Skin ${c.bold}${skinName}${c.reset} is already installed in ${c.cyan}${path.relative(process.cwd(), targetFile)}${c.reset}`);
    log.blank();
    log.info(`To reinstall, run:  ${c.gray}npx agent-skins remove ${skinName}${c.reset}  then add again.`);
    log.blank();
    return;
  }

  // Check if a DIFFERENT skin is already installed — skins conflict with each other
  const installedSkins = getInstalledSkins(existing);
  if (installedSkins.length > 0 && !flags.force) {
    log.blank();
    log.warn(`A skin is already active in ${c.cyan}${path.relative(process.cwd(), targetFile)}${c.reset}:`);
    installedSkins.forEach(s => log.raw(`     ${c.yellow}→${c.reset} ${c.bold}${s}${c.reset}`));
    log.blank();
    log.raw(`  Running multiple skins at once will cause them to conflict.`);
    log.raw(`  Remove the existing skin first, then add the new one:`);
    log.blank();
    installedSkins.forEach(s => log.raw(`     ${c.gray}npx agent-skins remove ${s}${c.reset}`));
    log.raw(`     ${c.gray}npx agent-skins add ${skinName}${c.reset}`);
    log.blank();
    log.raw(`  Or force install anyway (not recommended):`);
    log.raw(`     ${c.gray}npx agent-skins add ${skinName} --force${c.reset}`);
    log.blank();
    return;
  }

  // Append skin with markers
  const newContent = existing + wrapSkin(skinContent, skinName);
  fs.writeFileSync(targetFile, newContent, 'utf8');

  log.blank();
  log.success(`Skin ${c.bold}${c.magenta}${meta['display-name'] || skinName}${c.reset} installed!`);
  log.blank();
  log.raw(`  ${c.gray}→${c.reset} File:       ${c.cyan}${path.relative(process.cwd(), targetFile)}${c.reset}`);
  if (meta.category)    log.raw(`  ${c.gray}→${c.reset} Category:  ${meta.category}`);
  if (meta.emoji)       log.raw(`  ${c.gray}→${c.reset} Character: ${meta.emoji} ${meta['display-name'] || ''}`);
  if (meta.preview)     log.raw(`  ${c.gray}→${c.reset} Preview:   ${c.dim}"${meta.preview.slice(0, 80)}..."${c.reset}`);
  log.blank();
  log.raw(`  ${c.green}Your agent is now in character.${c.reset} Restart your agent to apply.`);
  log.blank();
}

/**
 * skins list [flags]
 */
async function list(args) {
  const flags = parseFlags(args);
  const filterCat = flags.category || flags.cat || null;

  log.blank();
  log.info('Fetching skin registry...');

  const manifest = await fetchManifest();
  const skins = manifest.skins || [];

  const filtered = filterCat
    ? skins.filter(s => s.category === filterCat)
    : skins;

  log.blank();
  log.raw(`  ${c.bold}${c.white}🎭 agent-skins registry${c.reset}  ${c.gray}(${filtered.length} skins)${c.reset}`);
  log.blank();

  // Group by category
  const groups = {};
  for (const skin of filtered) {
    const cat = skin.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skin);
  }

  const catColors = {
    fictional:  c.magenta,
    archetype:  c.green,
    historical: c.yellow,
    brand:      c.blue,
    other:      c.gray,
  };

  for (const [cat, items] of Object.entries(groups)) {
    const col = catColors[cat] || c.white;
    log.raw(`  ${col}${cat.toUpperCase()}${c.reset}`);
    for (const skin of items) {
      const emoji  = skin.emoji ? `${skin.emoji} ` : '  ';
      const name   = skin.name.padEnd(22);
      const dname  = (skin['display-name'] || '').slice(0, 24).padEnd(26);
      const tags   = (skin.tags || []).slice(0, 3).join(', ');
      log.raw(`    ${emoji}${c.bold}${name}${c.reset}  ${c.dim}${dname}${c.reset}  ${c.gray}${tags}${c.reset}`);
    }
    log.blank();
  }

  log.raw(`  Install any skin:  ${c.cyan}npx agent-skins add <name>${c.reset}`);
  log.raw(`  Skin details:      ${c.cyan}npx agent-skins info <name>${c.reset}`);
  log.blank();
}

/**
 * skins info <skin-name>
 */
async function info(args) {
  const flags = parseFlags(args);
  const skinName = flags._[0];

  if (!skinName) {
    throw new Error('Please specify a skin name. Example: npx agent-skins info yoda');
  }

  log.blank();
  log.info(`Fetching info for ${c.bold}${skinName}${c.reset}...`);

  const content = await fetchSkinContent(skinName);
  const { meta } = parseSkin(content);

  log.blank();
  log.raw(`  ${meta.emoji || '🎭'}  ${c.bold}${c.white}${meta['display-name'] || skinName}${c.reset}  ${c.gray}v${meta.version || '1.0'}${c.reset}`);
  log.blank();
  if (meta.description) {
    // Word-wrap description at 72 chars
    const words = meta.description.split(' ');
    let line = '  ';
    for (const w of words) {
      if (line.length + w.length > 74) { log.raw(line); line = '  '; }
      line += w + ' ';
    }
    if (line.trim()) log.raw(line);
    log.blank();
  }

  const field = (label, val) => val && log.raw(`  ${c.gray}${label.padEnd(15)}${c.reset}${val}`);
  field('category',    meta.category);
  field('tags',        (meta.tags || '').replace(/[\[\]]/g, ''));
  field('compatible',  meta.compatibility);
  field('author',      meta.author);
  field('license',     meta.license);
  if (meta['inspired-by']) field('inspired by', meta['inspired-by']);

  log.blank();
  if (meta.preview) {
    log.raw(`  ${c.dim}"${meta.preview}"${c.reset}`);
    log.blank();
  }

  log.raw(`  Install:  ${c.cyan}npx agent-skins add ${skinName}${c.reset}`);
  log.blank();
}

/**
 * skins search <query>
 */
async function search(args) {
  const flags = parseFlags(args);
  const query = flags._.join(' ').toLowerCase();

  if (!query) {
    throw new Error('Please provide a search query. Example: npx agent-skins search witty');
  }

  const manifest = await fetchManifest();
  const skins = manifest.skins || [];

  const results = skins.filter(s => {
    const haystack = [
      s.name, s['display-name'], s.description,
      ...(s.tags || []), s.category,
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  });

  log.blank();
  if (results.length === 0) {
    log.warn(`No skins found for "${query}"`);
    log.blank();
    log.info(`Browse all:  ${c.cyan}npx agent-skins list${c.reset}`);
    log.blank();
    return;
  }

  log.raw(`  ${c.bold}${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"${c.reset}`);
  log.blank();
  for (const s of results) {
    log.raw(`  ${s.emoji || '🎭'}  ${c.bold}${s.name}${c.reset}  ${c.dim}${s['display-name']}${c.reset}`);
    if (s.description) {
      log.raw(`     ${c.gray}${s.description.slice(0, 90).replace(/\n/g, ' ')}...${c.reset}`);
    }
    log.blank();
  }
  log.raw(`  Install:  ${c.cyan}npx agent-skins add <name>${c.reset}`);
  log.blank();
}

/**
 * skins remove <skin-name>
 */
async function remove(args) {
  const flags = parseFlags(args);
  const skinName = flags._[0];

  if (!skinName) {
    throw new Error('Please specify a skin name. Example: npx agent-skins remove jack-sparrow');
  }

  const targetFile = resolveTarget({
    target: flags.target,
    agent:  flags.agent,
    global: flags.global,
  });

  if (!fs.existsSync(targetFile)) {
    throw new Error(`File not found: ${targetFile}`);
  }

  const content = fs.readFileSync(targetFile, 'utf8');

  if (!isSkinInstalled(content, skinName)) {
    log.blank();
    log.warn(`Skin ${c.bold}${skinName}${c.reset} is not installed in ${c.cyan}${path.relative(process.cwd(), targetFile)}${c.reset}`);
    log.blank();
    return;
  }

  const updated = removeSkinBlock(content, skinName);
  fs.writeFileSync(targetFile, updated, 'utf8');

  log.blank();
  log.success(`Skin ${c.bold}${skinName}${c.reset} removed from ${c.cyan}${path.relative(process.cwd(), targetFile)}${c.reset}`);
  log.blank();
}

module.exports = { add, list, remove, info, search };
