# Seul, sous-agents ou équipe

## L'essentiel

Parcourir la grille dans l'ordre et s'arrêter à la première ligne qui correspond :

1. **Tâche claire, quelques fichiers, étapes qui s'enchaînent** : seul.
2. **Beaucoup à lire pour une réponse courte** (recherche dans le code, logs, documentation) : un sous-agent, `Explore` par exemple. Seul son résumé revient dans la conversation.
3. **Plusieurs sous-tâches indépendantes** (dossiers différents, questions séparées) : des sous-agents en parallèle.
4. **Code écrit qui doit être relu** : un sous-agent relecteur qui n'a pas écrit le code.
5. **Question ouverte, cause inconnue, pistes à confronter, ou fonctionnalité répartie sur des dossiers séparés qui demande des échanges** : une équipe d'agents, avec trois coéquipiers au maximum, sur Sonnet. Demander à l'utilisateur avant de la lancer.

Annoncer le choix en une ligne, avec sa raison.

Pourquoi l'équipe n'est pas le choix par défaut :
- **Le coût.** Chaque coéquipier est une session complète. D'après la documentation d'Anthropic, une équipe consomme environ 7 fois plus de tokens qu'une session normale quand les coéquipiers travaillent en mode plan. Les limites d'abonnement sont donc atteintes beaucoup plus vite.
- **La coordination.** Les fichiers partagés risquent d'être écrasés, les tâches qui dépendent les unes des autres font attendre, et le chef doit tout rassembler.
- **La qualité.** Elle vient d'une demande claire, d'une vérification et d'une relecture indépendante. Un seul sous-agent relecteur apporte l'essentiel de ce gain.
- **Le statut expérimental.** Pas de reprise de session avec les coéquipiers, statuts de tâches parfois en retard, une seule équipe par session, pas d'équipe imbriquée.

## Pour aller plus loin

### Schémas d'orchestration

- **En parallèle :** plusieurs sous-agents, chacun sur son périmètre, puis une synthèse par l'orchestrateur.
- **En chaîne :** plan, puis implémentation, tests et relecture ; chaque étape reçoit le résultat de la précédente.
- **Vérificateur :** l'auteur ne relit jamais son propre travail.
- **Débat (équipe) :** chaque coéquipier défend une hypothèse et essaie de réfuter celles des autres. L'hypothèse qui résiste a le plus de chances d'être la bonne.

### Modèle de brief pour un sous-agent

Un sous-agent part de zéro : le brief doit se suffire à lui-même.

```
Objectif : ce qu'il faut obtenir, et pourquoi.
Contexte : décisions déjà prises, contraintes, ce qui a été essayé.
Périmètre : fichiers et dossiers concernés ; ce qu'il ne faut pas modifier.
Rendu : format attendu (liste, tableau, fichiers modifiés), longueur maximale.
Critère de fin : comment savoir que c'est terminé.
```

### Règles

- **Un agent, un périmètre de fichiers.** Pour faire coder plusieurs agents en même temps, utiliser `isolation: worktree`.
- **Le bon modèle pour chaque rôle :**
  - `haiku` pour le travail mécanique ;
  - `sonnet` par défaut pour les sous-agents et les coéquipiers ;
  - `opus` pour l'orchestrateur et les décisions difficiles.
- **Borner la durée** avec `maxTurns`.
- **Arrêter les coéquipiers** dès que leur travail est fini : ils consomment des tokens jusqu'à leur arrêt.

### Équipes : mise en route

- **Activer** en ajoutant `"env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" }` dans `settings.json`.
- **Demander explicitement l'équipe**, par exemple « crée une équipe de 3 coéquipiers… », en nommant les rôles et les périmètres.
- **Affichage.** Par défaut, dans la session, ce qui marche partout. En panneaux côte à côte, il faut tmux ou iTerm2 ; ça ne marche pas dans Windows Terminal.
- **Contrôle qualité** avec les hooks `TeammateIdle`, `TaskCreated` et `TaskCompleted` : un code de sortie 2 renvoie le coéquipier au travail.
- **Commencer par des tâches sans code**, comme une recherche ou une relecture.

### Mesurer

Pour trancher, faire la même tâche seul, avec des sous-agents, puis en équipe, et comparer la qualité, la durée et la consommation affichée par `/usage`.
