# kit-hugo

Mon kit Claude Code, réutilisable dans tous mes projets.

## Contenu

| Élément | Rôle | État |
|---|---|---|
| Skill `/kit-hugo:aide-memoire` | Les briques de Claude Code, les commandes utiles, le choix entre travailler seul, avec des sous-agents ou en équipe, la façon de formuler une demande | Fait |
| Skill `/kit-hugo:demarrer-projet` | Mettre en place un projet, neuf ou existant : CLAUDE.md, permissions, hooks, agents propres au projet. Lancé seulement par l'utilisateur | Fait |
| Skill `/kit-hugo:bilan` | Repérer, à partir des sessions et de l'historique git, ce qui mérite de devenir un skill, un hook, un agent ou une partie du kit, et ce qui ne sert plus. Lancé seulement par l'utilisateur | Fait |
| Agents `relecteur` et `verificateur` | `relecteur` (Sonnet) relit du code sans le modifier. `verificateur` (Haiku) lance tests, typecheck, lint et build, et ne rend que les échecs | Fait |
| Hook `proteger-secrets` | Empêche Claude de lire ou de modifier un fichier secret (`.env`, clés, keystores, identifiants), avec un outil comme dans le terminal. Les modèles comme `.env.example` restent lisibles | Fait |

S'installent avec le kit : `claude-code-setup` et `claude-md-management` (marketplace officielle d'Anthropic).

Prérequis : Node.js, utilisé par le hook et par le script de `bilan`.

## Tests

```bash
node tests/proteger-secrets/lancer.mjs
```

## Tester en local

Sans installation, pour une session :

```bash
claude --plugin-dir ./plugins/kit-hugo
```

Installé depuis ce dossier (c'est le cas sur le PC de Hugo) :

```bash
claude plugin marketplace add C:/HugoProjects/kit-hugo
claude plugin install kit-hugo@hugo
```

Le plugin est alors lu directement dans ce dossier : une modification s'applique à la session suivante, sans réinstaller.

## Installer depuis GitHub

```bash
claude plugin marketplace add https://github.com/HugoFerry/kit-hugo.git
claude plugin install kit-hugo@hugo
```
