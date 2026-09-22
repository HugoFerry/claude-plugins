# Permissions et hooks du projet

## `.claude/settings.json`

Ce fichier est partagé via git. Les réglages personnels, non partagés, vont dans `.claude/settings.local.json`, qui doit être ignoré par git.

```json
{
  "permissions": {
    "allow": ["Bash(npm test *)", "Bash(npm run lint *)", "Bash(npm run typecheck *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

- **`allow`** : uniquement les commandes du projet sans risque (tests, lint, typecheck, build). Jamais une commande qui publie, déploie ou supprime.
- **`deny`** : les fichiers secrets que Claude ne doit pas lire.
- La syntaxe des règles évolue. En cas de doute, vérifie-la sur https://code.claude.com/docs/en/permissions.

## Hooks selon la stack

| Signal dans le projet | Hook | Événement |
|---|---|---|
| Linter configuré (oxlint, eslint, ruff) | Lint du fichier modifié, erreurs renvoyées à Claude | `PostToolUse`, matcher `Edit\|Write` |
| Formateur configuré (prettier, black) | Formatage du fichier modifié | `PostToolUse`, matcher `Edit\|Write` |
| Fichiers à ne jamais modifier (générés, fichiers de verrouillage) | Blocage, avec la raison | `PreToolUse`, code de sortie 2 |
| Tests rapides (moins de 10 secondes) | Tests à la fin du tour, seulement si le code a changé | `Stop` |

Un hook `Stop` qui renvoie le code 2 oblige Claude à continuer. Pour éviter une boucle sans fin quand un test reste rouge, le script doit sortir avec 0 si le champ `stop_hook_active` de son entrée vaut `true`.

Règles pour un bon hook :
- **Rapide :** quelques secondes au plus.
- **Ciblé :** il ne traite que le fichier concerné.
- **Silencieux quand tout va bien.**
- **Portable :** un script Node pour les projets JavaScript ou TypeScript, Python sinon. Évite `jq`, absent sur Windows.

## Modèle : lint d'un projet JavaScript ou TypeScript

À ajouter dans `.claude/settings.json` :

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/lint-fichier.mjs\"", "timeout": 30 }
      ]
    }
  ]
}
```

Fichier `.claude/hooks/lint-fichier.mjs` (remplacer `oxlint` par le linter du projet) :

```js
// Hook PostToolUse : lance le linter sur le fichier que Claude vient de modifier
// et lui renvoie les erreurs (code de sortie 2). Silencieux quand tout va bien.
import { execSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const file = JSON.parse(input).tool_input?.file_path ?? '';
if (!/\.[cm]?[jt]sx?$/.test(file)) process.exit(0);

try {
  execSync(`npx --no-install oxlint --deny-warnings "${file}"`, { stdio: 'pipe' });
} catch (e) {
  process.stderr.write(
    `Lint de ${file} : corrige ce que ta modification a introduit. ` +
      `Les avertissements déjà présents peuvent rester : signale-les sans les corriger.\n` +
      `${e.stdout ?? ''}${e.stderr ?? ''}`,
  );
  process.exit(2);
}
```

Beaucoup de linters terminent sans erreur quand ils ne trouvent que des avertissements, et le hook ne dirait alors rien. Force-les : `--deny-warnings` pour oxlint, `--max-warnings 0` pour eslint.

Tester le hook : introduire exprès un problème de lint dans un fichier (par exemple une instruction `debugger`), vérifier que Claude reçoit le message, puis annuler la modification.
