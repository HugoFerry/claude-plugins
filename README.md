# kit-hugo

Mon kit Claude Code, réutilisable dans tous mes projets.

## Contenu

| Élément | Rôle | État |
|---|---|---|
| Skill `/kit-hugo:aide-memoire` | Les briques de Claude Code, les commandes utiles, le choix entre travailler seul, avec des sous-agents ou en équipe | À faire |
| Skill `/kit-hugo:demarrer-projet` | Mettre en place un projet : CLAUDE.md, permissions, hooks, agents | À faire |
| Skill `/kit-hugo:bilan` | Repérer ce qui mérite de devenir un skill, un hook, un agent ou une partie du kit | À faire |
| Agents `relecteur` et `verificateur` | Relire le code, lancer les vérifications | À faire |
| Hook de protection | Empêcher la modification des fichiers secrets | À faire |

S'installent avec le kit : `claude-code-setup` et `claude-md-management` (marketplace officielle d'Anthropic).

## Tester en local

```bash
claude --plugin-dir ./plugins/kit-hugo
```

## Installer depuis GitHub

```bash
claude plugin marketplace add https://github.com/HugoFerry/kit-hugo.git
claude plugin install kit-hugo@hugo
```
