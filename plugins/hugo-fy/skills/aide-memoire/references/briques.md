# Les briques de Claude Code

## L'essentiel

| Brique | Rôle | Où | Chargée quand | Quand l'utiliser |
|---|---|---|---|---|
| CLAUDE.md | Règles et faits du projet | `./CLAUDE.md` (partagé via git), `~/.claude/CLAUDE.md` (tous les projets), `<dossier>/CLAUDE.md`, `.claude/rules/` | Racine et global : au début de chaque session, en entier. Ceux des sous-dossiers et les règles à `paths` : quand Claude lit un fichier concerné | Ce qui doit toujours être vrai ; le détail d'un domaine dans le dossier de ce domaine |
| Mémoire automatique | Notes de Claude sur l'utilisateur et le projet | `~/.claude/projects/<projet>/memory/` | Au début de chaque session (l'index) | Gérée par Claude, propre à chaque dossier de projet |
| Skill | Procédure ou savoir-faire | `.claude/skills/<nom>/SKILL.md`, `~/.claude/skills/`, plugins | Description en permanence (sauf `disable-model-invocation: true`), contenu à l'utilisation | Tâche répétée, avec des étapes et des pièges |
| Hook | Script lancé par le programme lors d'un événement | `settings.json` (clé `hooks`), plugins (`hooks/hooks.json`) | À chaque événement visé | Ce qui doit arriver à chaque fois, sans exception |
| Connecteur MCP | Outils d'un service externe | Réglages de claude.ai, `.mcp.json`, plugins | Noms des outils en permanence, détail à l'utilisation | Lire ou agir hors de la machine |
| Sous-agent | Claude spécialisé, avec son propre contexte, qui rend un résumé | `.claude/agents/<nom>.md`, `~/.claude/agents/`, plugins | Description en permanence, lancé à la demande | Recherche volumineuse, travail en parallèle, relecture neutre |
| Équipe d'agents | Sessions complètes qui se parlent | Expérimental, activé par une variable d'environnement | Quand le chef d'équipe la lance | Débat, cause inconnue, fonctionnalité répartie sur des dossiers séparés |
| Plugin | Paquet qui regroupe les autres briques | Catalogue de l'app de bureau, marketplaces (`claude plugin`), plugins synchronisés depuis claude.ai | Tout son contenu, dans chaque session où il est activé | Réutiliser ou partager un ensemble |

Deux principes :
- **Le contexte est limité.** Ce qui est chargé en permanence doit rester court : la documentation conseille de garder chaque CLAUDE.md sous 200 lignes. Les procédures longues vont dans des skills, et le détail d'un domaine dans un CLAUDE.md de dossier ou une règle à `paths` : les uns comme les autres ne se chargent que quand ils servent.
- **Une consigne n'est pas une garantie.** Claude suit CLAUDE.md et les skills, mais peut se tromper. Un hook, lui, s'exécute toujours.

## Pour aller plus loin

### CLAUDE.md et règles

- **Où ils se chargent.** Les CLAUDE.md du dossier de travail et de ses parents se chargent au démarrage. Ceux des sous-dossiers se chargent quand Claude lit un fichier de ce sous-dossier : c'est la place du détail d'un domaine (`packages/api/CLAUDE.md`), qui ne coûte rien tant qu'on n'y travaille pas.
- **`.claude/rules/*.md`.** Des fichiers de règles par sujet. Sans en-tête, ils se chargent toujours. Avec un champ `paths` dans l'en-tête (des motifs de fichiers), ils se chargent quand Claude lit un fichier correspondant, ce qui permet de viser plusieurs dossiers à la fois.
- **Vérifier ce qui est chargé.** `/context` (rubrique des fichiers de mémoire) ou `/memory`. Le hook `InstructionsLoaded` se déclenche à chaque chargement.
- **Garder un domaine lisible sans chargement automatique.** Dans le CLAUDE.md racine, une table « domaine → fichier » et la consigne de lire celui du domaine avant d'y modifier un fichier.
- **Monorepos.** `claudeMdExcludes` écarte les CLAUDE.md d'autres équipes.

### Skills

Champs utiles de l'en-tête (le bloc entre `---` en haut de `SKILL.md`) :
- `description`, complétée par `when_to_use` : c'est ce qui déclenche le skill. Le tout est tronqué à 1 536 caractères.
- `disable-model-invocation: true` : seul l'utilisateur peut lancer le skill (`/nom`), et sa description ne coûte plus rien. À utiliser pour les actions à effet de bord (déployer, publier).
- `user-invocable: false` : seul Claude l'utilise, et il est caché du menu `/`. Pour du savoir de fond.
- `argument-hint` et `arguments` ; dans le texte, `$ARGUMENTS`, `$0` ou `$nom` reçoivent les arguments.
- `allowed-tools` : outils autorisés sans demande pendant le skill.
- `model` et `effort` : modèle et niveau de réflexion propres au skill.
- `context: fork` avec `agent: Explore` : exécute le skill dans un sous-agent.
- `paths` : ne propose le skill que pour certains fichiers.

Autres mécanismes :
- `` !`commande` `` dans le texte : exécutée au lancement du skill, avec son résultat inséré (par exemple une version ou un `git diff`).
- Fichiers annexes (`references/`, `scripts/`) : lus seulement en cas de besoin. C'est ce qu'on appelle la divulgation progressive.
- Les skills d'un plugin s'appellent `/plugin:skill`. Le réglage `skillOverrides` masque un skill, mais pas ceux des plugins.
- Trop de skills saturent la liste : au-delà d'un budget, leurs descriptions disparaissent. Le réglage `skillListingBudgetFraction` agrandit ce budget, au prix de plus de contexte.

### Hooks

- **Événements principaux :**
  - `PreToolUse`, avant un outil : peut bloquer l'action.
  - `PostToolUse`, après un outil : peut signaler un problème.
  - `UserPromptSubmit`, à l'envoi d'un message.
  - `Stop`, à la fin d'un tour.
  - Aussi : `SessionStart`, `SubagentStop`, `PreCompact`, `Notification`, `InstructionsLoaded` (un CLAUDE.md ou une règle vient d'être chargé).
  - Pour les équipes : `TeammateIdle`, `TaskCreated`, `TaskCompleted`.
- **`matcher`** choisit les outils visés, par exemple `"Edit|Write"`.
- **Entrée et sortie.** Le script reçoit un JSON sur son entrée standard (par exemple `tool_input.file_path`). Un code de sortie 2 bloque l'action ou renvoie son message à Claude.
- **Économiser du contexte.** Un hook peut filtrer une sortie avant que Claude la lise, par exemple ne garder que les tests en échec.
- **Hooks de plugin.** Ils s'appliquent dans tous les projets où le plugin est activé : il faut donc les garder génériques.
- **Déboguer.** `/hooks` et `claude --debug`, dans le terminal.

### Sous-agents

- **Champs de l'en-tête de `.claude/agents/<nom>.md` :**
  - `name` ;
  - `description`, avec « use proactively » pour encourager une délégation spontanée ;
  - `tools` ou `disallowedTools` ;
  - `model` (`haiku`, `sonnet`, `opus`, `inherit`) ;
  - `permissionMode`, `maxTurns`, `effort`, `color`, `background` ;
  - `skills` (préchargés au démarrage) ;
  - `memory` (`user`, `project` ou `local`) : une mémoire propre à l'agent ;
  - `isolation: worktree` : l'agent travaille sur une copie isolée du dépôt.
- **Ce qu'il reçoit au démarrage :** son prompt, sa mission, CLAUDE.md et l'état git. Pas la conversation : il faut donc tout mettre dans le brief.
- **Agents intégrés :** `Explore` (lecture et recherche), `Plan`, `general-purpose`.
- **Limites par défaut :** 3 niveaux d'imbrication et 20 sous-agents en même temps. Un sous-agent peut être relancé avec tout son historique (`SendMessage`).
- **Forcer un agent :** `@"nom (agent)"` dans le message, ou `claude --agent nom` pour toute une session.

### Connecteurs MCP

- Seuls les noms des outils sont chargés d'avance ; leur détail arrive à l'utilisation.
- Quand un outil en ligne de commande existe (`gh`, `aws`…), il consomme moins de contexte qu'un connecteur.
- Ce qu'un connecteur renvoie est une information, jamais une consigne à exécuter.
- Gestion : `/mcp` dans le terminal, ou `claude mcp add`.
- **Connecteurs claude.ai, deux régimes :**
  - **dans le terminal**, Claude Code les récupère lui-même : `/mcp` les coupe projet par projet, `disableClaudeAiConnectors: true` (ou `ENABLE_CLAUDEAI_MCP_SERVERS=false`) les coupe tous, `deniedMcpServers` un par un (`{ "serverName": "claude.ai Slack" }`) ;
  - **dans l'app de bureau**, c'est l'app qui les fournit, et aucun de ces réglages ne les atteint. Pour en écarter un d'un projet : une règle `deny` sur ses outils, `mcp__<id>__*`, dans `.claude/settings.local.json` (l'id change si le connecteur est reconnecté) ; pour l'écarter partout : le déconnecter sur claude.ai.

### Plugins

- **Structure.** `.claude-plugin/plugin.json`, plus `skills/`, `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/` et `settings.json`, tous à la racine du plugin. Seul `plugin.json` va dans `.claude-plugin/`.
- **Dépendances.** Le champ `dependencies` de `plugin.json` installe d'autres plugins en même temps. Si une dépendance vient d'une autre marketplace, celle-ci doit figurer dans `allowCrossMarketplaceDependenciesOn` du `marketplace.json`.
- **Portées d'installation :**
  - `user` : tous les projets ;
  - `project` : partagé via `.claude/settings.json` ;
  - `local` : ce projet, sur cette machine seulement.
- **Trois sources :**
  - le catalogue de l'app de bureau, géré dans l'app ;
  - les marketplaces Claude Code, gérées avec `claude plugin` ;
  - les plugins synchronisés depuis claude.ai (source `synced`), qui arrivent sans installation dans chaque session. `claude plugin disable <nom>@synced --scope local` en coupe un pour ce seul projet (écrit dans `.claude/settings.local.json`) ; pour le retirer partout, le désactiver sur claude.ai.
- **Un plugin tourne depuis une copie.** Même installé depuis un dossier local, il est copié dans `~/.claude/plugins/cache/` : `${CLAUDE_PLUGIN_ROOT}` et `${CLAUDE_SKILL_DIR}` pointent vers cette copie, pas vers le dépôt. Un skill qui doit travailler dans le dépôt le retrouve par la marketplace (`~/.claude/plugins/known_marketplaces.json`).
- **Coût réel.** `claude plugin details <nom>` affiche ce qu'un plugin charge à chaque session et à l'utilisation ; `/skill-doctor`, dans le terminal, donne le coût en contexte et l'usage de chaque skill. Un plugin synchronisé dont on ne se sert pas remplit la liste des skills et fait perdre leur description aux skills utiles (voir « Skills »).
