---
name: aide-memoire
description: Aide-mémoire de Claude Code. Quelle brique utiliser (CLAUDE.md, skill, hook, MCP, sous-agent, équipe d'agents, plugin), quelles commandes connaître, comment choisir entre travailler seul, avec des sous-agents ou en équipe, et comment formuler une demande. À utiliser quand l'utilisateur hésite sur l'outil ou la méthode, cherche une commande, ou avant de lancer plusieurs agents.
argument-hint: "[briques | commandes | agents | demandes]"
---

# Aide-mémoire Claude Code

Sujet demandé : $ARGUMENTS

Les fiches sont dans le dossier de ce skill. Lis seulement celle qui correspond au sujet :

| Sujet | Fiche | Contenu |
|---|---|---|
| briques | [references/briques.md](references/briques.md) | CLAUDE.md, mémoire, skills, hooks, MCP, sous-agents, équipes, plugins : rôle, emplacement, coût, pièges, réglages avancés |
| commandes | [references/commandes.md](references/commandes.md) | Commandes de session, de qualité, de configuration, d'automatisation, et le CLI `claude plugin` |
| agents | [references/agents.md](references/agents.md) | Choisir entre seul, sous-agents et équipe ; schémas d'orchestration ; modèle de brief ; coûts |
| demandes | [references/demandes.md](references/demandes.md) | Formuler une demande efficace ; modèles réutilisables |

## Comment répondre

- **Si un sujet est donné**, lis la fiche correspondante et réponds à partir d'elle.
- **Sans sujet**, présente le tableau en une phrase par ligne et demande ce que l'utilisateur veut approfondir.
- **Avant de choisir toi-même un mode de travail** pour une tâche non triviale, lis `agents.md`.
- **Chaque fiche a deux niveaux** : « L'essentiel », puis « Pour aller plus loin ». Commence par l'essentiel, et va plus loin si la question le demande ou si l'utilisateur maîtrise déjà la base.
- **Relie la réponse au projet en cours** avec un exemple concret.
- **Si une information d'une fiche semble dépassée**, vérifie dans la documentation officielle (https://code.claude.com/docs) et signale l'écart.
