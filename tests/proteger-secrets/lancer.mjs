// Passe chaque cas de cas.json au hook proteger-secrets et vérifie sa décision.
// Usage (depuis la racine du dépôt) : node tests/proteger-secrets/lancer.mjs
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const hook = join(ici, '..', '..', 'plugins', 'kit-hugo', 'hooks', 'proteger-secrets.mjs');
const cas = JSON.parse(readFileSync(join(ici, 'cas.json'), 'utf8'));

let echecs = 0;
for (const { attendu, entree } of cas) {
  const r = spawnSync(process.execPath, [hook], { input: JSON.stringify(entree), encoding: 'utf8' });
  const obtenu = r.status === 2 ? 'bloqué' : r.status === 0 ? 'autorisé' : `erreur (code ${r.status})`;
  const ok = obtenu === attendu;
  if (!ok) echecs++;
  const cible = entree.tool_input.file_path ?? entree.tool_input.path ?? entree.tool_input.command;
  console.log(`${ok ? 'OK   ' : 'ÉCHEC'} ${entree.tool_name.padEnd(10)} ${cible.padEnd(44)} attendu ${attendu}, obtenu ${obtenu}`);
}
console.log(`\n${cas.length - echecs}/${cas.length} cas conformes`);
process.exit(echecs ? 1 : 0);
