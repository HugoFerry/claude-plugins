---
name: demarrer-projet
description: Met en place Claude Code dans un projet, neuf ou existant. Écrit le CLAUDE.md, règle les permissions et les hooks, et ajoute les agents propres au projet, en s'appuyant sur l'analyse de claude-code-setup.
argument-hint: "[description du projet, s'il est neuf]"
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash(pwd) Bash(ls *) Bash(git rev-parse *) Bash(echo *)
---

# Démarrer un projet avec Claude Code

Demande : $ARGUMENTS

## État du dossier

!`pwd`

!`ls -A | head -40`

!`git rev-parse --is-inside-work-tree 2>/dev/null || echo "pas un dépôt git"`

!`ls -d CLAUDE.md .claude 2>&1 || echo "(au moins l'un des deux est absent)"`

## Principes

- Les règles personnelles de l'utilisateur sont déjà dans `~/.claude/CLAUDE.md` : ne les recopie pas dans le projet.
- Le kit fournit déjà, dans tous les projets, les agents `relecteur` et `verificateur` ainsi que la protection des fichiers secrets : ne les recrée pas.
- Pas de skill au départ : les skills naissent de l'usage (`/kit-hugo:bilan`), sauf pour une procédure déjà connue et répétitive.
- N'écris rien avant d'avoir présenté le plan et obtenu l'accord. En mode non interactif, arrête-toi après le plan.
- Ne commite et ne pousse rien sans demande.
- Si un CLAUDE.md ou un `.claude/` existe déjà, complète-les sans écraser ce qui s'y trouve.

## Étapes

1. **Comprendre le projet.**
   - Projet existant : lis le README, le manifeste (`package.json`, `pyproject.toml`, `build.gradle`…), la structure des dossiers, la CI et les tests. Repère les commandes de build, de test, de lint et de formatage, ainsi que les fichiers sensibles (secrets, fichiers générés, clés).
   - Dossier vide : pose en une seule fois les questions utiles (objectif, utilisateurs, plateforme, contraintes) et propose une stack avec ta recommandation. Une fois validée, crée le squelette avec l'outil officiel de la stack, puis continue comme pour un projet existant.
2. **Recommandations.** Lance le skill `claude-code-setup:claude-automation-recommender`. Garde ce qui sert ce projet dès maintenant, et écarte le reste en une ligne chacun.
3. **Plan.** Présente en une fois ce que tu vas créer (fichiers et contenu résumé) et pourquoi. Attends l'accord.
4. **Mise en place.**
   - Git : `git init` si besoin, et un `.gitignore` qui exclut les secrets, les dépendances et les builds.
   - `CLAUDE.md` : suis [references/modele-claude-md.md](references/modele-claude-md.md).
   - `.claude/settings.json` : permissions et hooks selon [references/reglages.md](references/reglages.md). Préviens l'utilisateur qu'il verra une demande d'autorisation. Claude Code protège toujours ses propres fichiers de configuration, parce que les modifier revient à changer ses permissions. Sans interface, l'écriture est refusée : donne alors le contenu à l'utilisateur pour qu'il crée le fichier lui-même.
   - Agents propres au projet (par exemple un vérificateur métier), seulement si l'analyse en montre le besoin, dans `.claude/agents/`.
   - Connecteurs MCP : seulement ceux qui servent dès maintenant. Préfère un outil en ligne de commande quand il existe.
5. **Vérification.**
   - Lance les commandes notées dans CLAUDE.md (tests, lint, build) pour prouver qu'elles fonctionnent.
   - Teste chaque hook : modifie un fichier exprès pour le déclencher, puis annule la modification.
   - Vérifie que chaque fichier JSON est valide.
6. **Bilan.**
   - Un tableau de ce qui a été créé, avec la raison de chaque élément.
   - Ce qui n'a pas pu être vérifié.
   - Un message de commit proposé.
   - Un rappel : lancer `/kit-hugo:bilan` après quelques sessions de travail.
