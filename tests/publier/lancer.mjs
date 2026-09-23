// Vérifie que le script d'en-tête du skill publier retrouve le dépôt, ou dit qu'il n'y en a pas.
// Chaque cas utilise un dossier de configuration temporaire (CLAUDE_CONFIG_DIR) : rien n'est lu
// ni écrit dans ~/.claude.
// Usage (depuis la racine du dépôt) : node tests/publier/lancer.mjs
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, '..', '..');
const script = join(racine, 'plugins', 'hugo-fy', 'skills', 'publier', 'scripts', 'etat-depot.mjs');
const depot = execFileSync('git', ['-C', racine, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const temporaire = mkdtempSync(join(tmpdir(), 'hugo-fy-publier-'));

const configAvec = (nom, marketplaces) => {
  const config = join(temporaire, nom);
  mkdirSync(join(config, 'plugins'), { recursive: true });
  if (marketplaces) writeFileSync(join(config, 'plugins', 'known_marketplaces.json'), JSON.stringify(marketplaces));
  return config;
};
const horsDepot = join(temporaire, 'copie-du-cache');
mkdirSync(horsDepot);

const cas = [
  {
    nom: 'skill chargé depuis le clone',
    dossierDuSkill: join(racine, 'plugins', 'hugo-fy', 'skills', 'publier'),
    config: configAvec('vide'),
    attendu: `Dépôt : ${depot}`,
  },
  {
    nom: 'copie du cache, marketplace installée depuis le clone',
    dossierDuSkill: horsDepot,
    config: configAvec('dossier', { hugoferry: { source: { source: 'directory', path: racine }, installLocation: racine } }),
    attendu: `Dépôt : ${depot}`,
  },
  {
    nom: 'copie du cache, marketplace installée depuis GitHub',
    dossierDuSkill: horsDepot,
    config: configAvec('github', { hugoferry: { source: { source: 'github', repo: 'HugoFerry/claude-plugins' }, installLocation: horsDepot } }),
    attendu: 'PAS DE DÉPÔT GIT ICI',
  },
  {
    nom: 'copie du cache, aucune marketplace connue',
    dossierDuSkill: horsDepot,
    config: configAvec('sans-fichier'),
    attendu: 'PAS DE DÉPÔT GIT ICI',
  },
];

let echecs = 0;
for (const { nom, dossierDuSkill, config, attendu } of cas) {
  const r = spawnSync(process.execPath, [script, dossierDuSkill], {
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_CONFIG_DIR: config },
  });
  const obtenu = r.status === 0 ? r.stdout.split('\n')[0] : `erreur (code ${r.status}) ${r.stderr.trim()}`;
  const ok = obtenu === attendu;
  if (!ok) echecs++;
  console.log(`${ok ? 'OK   ' : 'ÉCHEC'} ${nom.padEnd(56)} ${ok ? '' : `attendu « ${attendu} », obtenu « ${obtenu} »`}`);
}
rmSync(temporaire, { recursive: true, force: true });
console.log(`\n${cas.length - echecs}/${cas.length} cas conformes`);
process.exit(echecs ? 1 : 0);
