# kit-hugo

Mon kit Claude Code, réutilisable dans tous mes projets.

## Contenu

| Élément | Rôle |
|---|---|
| Skill `/kit-hugo:aide-memoire` | Les briques de Claude Code, les commandes utiles, le choix entre travailler seul, avec des sous-agents ou en équipe, la façon de formuler une demande |
| Skill `/kit-hugo:demarrer-projet` | Mettre en place un projet, neuf ou existant : CLAUDE.md, permissions, hooks, agents propres au projet. Lancé seulement par l'utilisateur |
| Skill `/kit-hugo:bilan` | Repérer, à partir des sessions et de l'historique git, ce qui mérite de devenir un skill, un hook, un agent ou une partie du kit, et ce qui ne sert plus. Lancé seulement par l'utilisateur |
| Agents `relecteur` et `verificateur` | `relecteur` (Sonnet) relit du code sans le modifier. `verificateur` (Haiku) lance tests, typecheck, lint et build, et ne rend que les échecs |
| Hook `proteger-secrets` | Empêche Claude de lire ou de modifier un fichier secret (`.env`, clés, keystores, identifiants), avec un outil comme dans le terminal. Les modèles comme `.env.example` restent lisibles |

S'installent avec le kit : `claude-code-setup` et `claude-md-management`, de la marketplace officielle d'Anthropic.

Prérequis : Node.js, utilisé par le hook et par le script de `bilan`.

## Installer

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add https://github.com/HugoFerry/kit-hugo.git
claude plugin install kit-hugo@hugo
```

La première commande n'est utile que si la marketplace officielle n'est pas encore déclarée ; elle fournit les dépendances du kit. Le kit se met ensuite à jour tout seul.

## Faire évoluer le kit

Sur l'ordinateur où l'on modifie le kit, on l'installe depuis le dossier cloné plutôt que depuis GitHub. Il est alors lu sur place : une modification s'applique dès la session suivante, sans réinstaller.

```bash
claude plugin marketplace add <chemin du dossier cloné>
claude plugin install kit-hugo@hugo
```

Pour un essai ponctuel sans rien installer :

```bash
claude --plugin-dir ./plugins/kit-hugo
```

## Tests

```bash
claude plugin validate ./plugins/kit-hugo
node tests/proteger-secrets/lancer.mjs
```
