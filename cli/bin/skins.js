#!/usr/bin/env node
'use strict';

const { add, list, remove, info, search } = require('../lib/commands');

const args = process.argv.slice(2);
const command = args[0];

const HELP = `
  🎭 skins — AI agent character skins

  USAGE
    npx agent-skins add <skin>         Install a skin into your project
    npx agent-skins list               Browse all available skins
    npx agent-skins info <skin>        Show details about a skin
    npx agent-skins search <query>     Search skins by name or tag
    npx agent-skins remove <skin>      Remove an installed skin

  OPTIONS
    --target <file>    Config file to install into  [default: auto-detect]
    --agent <agent>    Target agent  (claude|cursor|codex|gemini|raw)
    --global           Install to global ~/.claude/CLAUDE.md
    --dry-run          Preview without writing any files

  EXAMPLES
    npx agent-skins add jack-sparrow
    npx agent-skins add sherlock-holmes --agent cursor
    npx agent-skins add yoda --target my-project/CLAUDE.md
    npx agent-skins list
    npx agent-skins search witty

  DOCS
    https://github.com/azw293/agent-skins
`;

async function main() {
  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    const pkg = require('../package.json');
    console.log(pkg.version);
    process.exit(0);
  }

  try {
    switch (command) {
      case 'add':
      case 'install':
        await add(args.slice(1));
        break;
      case 'list':
      case 'ls':
        await list(args.slice(1));
        break;
      case 'info':
      case 'show':
        await info(args.slice(1));
        break;
      case 'search':
        await search(args.slice(1));
        break;
      case 'remove':
      case 'uninstall':
        await remove(args.slice(1));
        break;
      default:
        console.error(`\n  Unknown command: ${command}\n`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\n  ✖ ${err.message}\n`);
    process.exit(1);
  }
}

main();
