# Commandes utiles

## L'essentiel

| Besoin | Commande |
|---|---|
| Repartir d'une table vide entre deux sujets | `/clear` |
| Résumer la conversation tout de suite, en disant quoi garder | `/compact garde les décisions et les fichiers modifiés` |
| Annuler les dernières modifications de Claude | `/rewind`, ou Échap deux fois (terminal) |
| Préparer un plan avant de coder | Mode plan (Maj+Tab dans le terminal) |
| Relire des changements | `/code-review` |
| Simplifier le code modifié | `/simplify` |
| Vérifier qu'une modification marche dans l'app | `/run` |
| Faire réfléchir plus ou moins | `/effort` |
| Changer de modèle | `/model` |
| Obtenir des réponses plus rapides (même modèle Opus) | `/fast` |

## Pour aller plus loin

### Session et coûts

- `/context` : ce qui occupe la fenêtre de contexte.
- `/usage` : la consommation. Sur un abonnement, indique aussi la part de chaque skill, sous-agent, plugin et connecteur.
- `/insights` : rapport HTML sur les sessions récentes (sujets, points de friction, suggestions), enregistré dans `~/.claude/usage-data/report.html`.
- `/rename`, puis `/resume` : nommer une session pour la retrouver plus tard.

### Qualité

- `/code-review` accepte un niveau : `low`, `medium`, `high`, `xhigh`, `max`, ou `ultra` (relecture par plusieurs agents dans le cloud, facturée).
  - `--fix` applique les corrections.
  - `--comment` publie les remarques sur la pull request.
- `/security-review` : relecture centrée sur la sécurité.

### Configuration

- `/init` : rédige un premier CLAUDE.md.
- `/fewer-permission-prompts` : autorise d'avance les commandes de lecture fréquentes.
- `/skills` : activer, réduire ou masquer des skills.
- `/plugin`, `/reload-plugins`, `/mcp`, `/hooks`, `/agents` : gérer les briques (terminal).

### Automatisation

- `/loop 10m <demande>` : répète une demande à intervalle régulier. Sans intervalle, Claude choisit lui-même le rythme.
- `/schedule` : tâches planifiées dans le cloud (routines).
- `claude -p "<demande>"` : Claude sans interface, dans un script ou la CI.

### CLI `claude plugin`

- `claude plugin install <nom>@<marketplace>`, avec `--scope user|project|local`.
- `claude plugin list` ; `claude plugin details <nom>` pour l'inventaire et le coût en tokens.
- `claude plugin disable`, `enable` ou `uninstall <nom>`.
- `claude plugin marketplace add <dépôt>` pour ajouter une marketplace, `claude plugin marketplace update` pour la rafraîchir.
- `claude plugin validate <dossier>` ; `claude plugin init <nom>`.
- `claude update` : met le CLI à jour.
