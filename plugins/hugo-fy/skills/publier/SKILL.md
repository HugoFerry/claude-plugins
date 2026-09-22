---
name: publier
description: Publie une nouvelle version du plugin hugo-fy sur GitHub. Récupère les changements faits ailleurs, vérifie, augmente le numéro de version, commite, puis pousse après accord, pour que les autres ordinateurs reçoivent la mise à jour.
argument-hint: "[patch | minor | major, ou résumé des changements]"
disable-model-invocation: true
allowed-tools: Read Edit Bash(git *) Bash(node *) Bash(claude plugin validate *) Bash(echo *)
---

# Publier une nouvelle version de hugo-fy

Demande : $ARGUMENTS

## État du dépôt

!`git -C "${CLAUDE_SKILL_DIR}" rev-parse --show-toplevel 2>&1 || echo "PAS DE DÉPÔT GIT ICI"`

!`git -C "${CLAUDE_SKILL_DIR}" status --short --branch 2>&1 || echo "-"`

!`git -C "${CLAUDE_SKILL_DIR}" log --oneline -8 2>&1 || echo "-"`

## Principes

- Le numéro de version de `plugins/hugo-fy/.claude-plugin/plugin.json` décide des mises à jour : les autres ordinateurs ne reçoivent une nouvelle version que s'il change.
- Rien n'est poussé sans l'accord de l'utilisateur. En mode non interactif, arrête-toi avant le push.
- Au moindre échec (conflit, validation, test), arrête-toi et explique.

## Étapes

1. **Vérifier le dépôt.** Si la première ligne de l'état ci-dessus dit « PAS DE DÉPÔT GIT ICI », le plugin a été installé depuis GitHub et ne peut pas être modifié sur place. Explique alors comment faire : `git clone https://github.com/HugoFerry/claude-plugins.git`, puis installer le plugin depuis ce dossier (voir le README). Toutes les commandes suivantes se lancent à la racine du dépôt.
2. **Récupérer les changements faits ailleurs** avec `git pull --rebase`. En cas de conflit, arrête-toi.
3. **Faire le point.** Liste les changements depuis la dernière version, à partir de `git log` et `git diff` depuis le dernier commit « Version … ». Déduis-en le type de version, sauf si l'argument le précise :
   - **patch** (0.2.0 vers 0.2.1) : correction, précision d'un texte ;
   - **minor** (0.2.0 vers 0.3.0) : nouveau skill, agent ou hook, ou comportement modifié ;
   - **major** (0.2.0 vers 1.0.0) : commande renommée ou supprimée, qui casse les habitudes.
4. **Vérifier.**
   - `claude plugin validate .` et `claude plugin validate ./plugins/hugo-fy` : aucune erreur.
   - Tous les tests : `node tests/<dossier>/lancer.mjs`, pour chaque dossier de `tests/`.
5. **Mettre à jour.**
   - Le champ `version` de `plugins/hugo-fy/.claude-plugin/plugin.json`.
   - Le tableau « Contenu » du README, si un skill, un agent ou un hook a été ajouté, retiré ou a changé de rôle.
6. **Récapituler et demander l'accord :** version actuelle et nouvelle, liste des changements, résultat des vérifications.
7. **Publier**, après accord.
   - Commit « Version X.Y.Z : <résumé> », avec le détail des changements dans le corps du message.
   - `git push`.
   - Vérifier avec `git status -sb` que la branche est à jour avec `origin`.
8. **Conclure** en rappelant comment les autres ordinateurs reçoivent la mise à jour :
   - avec les mises à jour automatiques activées, au prochain démarrage de Claude Code, puis `/reload-plugins` ;
   - sinon, `claude plugin marketplace update hugoferry` puis `claude plugin update hugo-fy@hugoferry`.

   Sur un ordinateur où le plugin est installé depuis un dossier cloné, il suffit de faire `git pull` dans ce dossier.
