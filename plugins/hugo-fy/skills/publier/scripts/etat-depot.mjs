// Trouve le dépôt git du kit et affiche son état, pour l'en-tête du skill publier.
// Le plugin tourne depuis une copie dans ~/.claude/plugins/cache/, qui n'est pas un dépôt.
// On essaie donc le dossier du skill (plugin chargé depuis le clone, avec --plugin-dir),
// puis une marketplace installée depuis un dossier local qui contient plugins/hugo-fy.
// Usage : node etat-depot.mjs <dossier du skill>
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const racineGit = (dossier) => {
  try {
    return execFileSync('git', ['-C', dossier, 'rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

const depuisMarketplaces = () => {
  const config = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude');
  let marketplaces;
  try {
    marketplaces = JSON.parse(readFileSync(join(config, 'plugins', 'known_marketplaces.json'), 'utf8'));
  } catch {
    return null;
  }
  for (const marketplace of Object.values(marketplaces)) {
    const dossier = marketplace?.installLocation;
    if (marketplace?.source?.source !== 'directory' || !dossier) continue;
    if (!existsSync(join(dossier, 'plugins', 'hugo-fy', '.claude-plugin', 'plugin.json'))) continue;
    const racine = racineGit(dossier);
    if (racine) return racine;
  }
  return null;
};

const depot = (process.argv[2] && racineGit(process.argv[2])) || depuisMarketplaces();
if (!depot) {
  console.log('PAS DE DÉPÔT GIT ICI');
  process.exit(0);
}
const git = (...args) => execFileSync('git', ['-C', depot, ...args], { encoding: 'utf8' }).trimEnd();
console.log(`Dépôt : ${depot}\n\n${git('status', '--short', '--branch')}\n\n${git('log', '--oneline', '-8')}`);
