'use strict';

// The GitHub repo that hosts all skins
const GITHUB_USER = 'azw293';
const GITHUB_REPO = 'agent-skins';
const GITHUB_BRANCH = 'main';

// Base URL for fetching raw SKIN.md files
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// URL for the machine-readable manifest
const MANIFEST_URL = `${RAW_BASE}/skins.json`;

/**
 * Fetch the full skins manifest from GitHub
 */
async function fetchManifest() {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(MANIFEST_URL, { headers: { 'User-Agent': 'agent-skins-cli' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        reject(new Error('Redirect encountered — check your network or the registry URL.'));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch manifest (HTTP ${res.statusCode}). Check your internet connection.`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse skin manifest. The registry may be temporarily unavailable.'));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch the raw SKIN.md content for a specific skin
 */
async function fetchSkinContent(skinName) {
  const https = require('https');
  const url = `${RAW_BASE}/skins/${skinName}/SKIN.md`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'agent-skins-cli' } }, (res) => {
      if (res.statusCode === 404) {
        reject(new Error(`Skin not found: "${skinName}". Run 'npx agent-skins list' to see available skins.`));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch skin "${skinName}" (HTTP ${res.statusCode}).`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Extract frontmatter from a SKIN.md string
 * Returns { meta: {}, body: '' }
 */
function parseSkin(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const rawYaml = match[1];
  const body = match[2].trim();

  // Simple YAML parser for flat key:value pairs (no dep on js-yaml)
  const meta = {};
  for (const line of rawYaml.split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim().replace(/^["']|["']$/g, '');
      meta[kv[1]] = val;
    }
  }

  return { meta, body };
}

module.exports = { fetchManifest, fetchSkinContent, parseSkin, RAW_BASE, GITHUB_USER, GITHUB_REPO };
