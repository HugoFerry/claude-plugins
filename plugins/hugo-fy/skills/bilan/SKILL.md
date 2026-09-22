---
name: bilan
description: Fait le bilan d'un projet pour repérer ce qui mérite d'être automatisé : procédure répétée (skill), oubli ou correction qui revient (hook ou règle CLAUDE.md), grosse tâche isolable (sous-agent), élément utile à plusieurs projets (kit), et ce qui ne sert plus. Propose d'abord, n'applique rien sans accord.
argument-hint: "[nombre de sessions à analyser, 20 par défaut]"
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash(node *) Bash(git log *) Bash(claude plugin details *)
---

# Bilan d'automatisation

Demande : $ARGUMENTS

## Matière première

Activité récente (demandes de l'utilisateur, usage des skills, agents et commandes, historique git) :

!`node "${CLAUDE_SKILL_DIR}/scripts/resume-sessions.mjs" 20`

Si l'utilisateur demande un autre nombre de sessions, relance `node "${CLAUDE_SKILL_DIR}/scripts/resume-sessions.mjs" <nombre>`.

Les commandes comptées sont celles que Claude a lancées, souvent pour explorer. Elles ne disent pas si l'utilisateur a dû les valider une à une : une allow-list ne se justifie que si les demandes d'autorisation reviennent vraiment dans les sessions.

## Ce qu'il faut chercher

| Signal | Proposition |
|---|---|
| Une procédure en plusieurs étapes qui revient au moins deux fois (demandes semblables, commits de même forme) | Un skill : dans le projet, ou dans le kit si elle sert dans plusieurs projets |
| Une correction ou un rappel répétés (« lance les tests », « pas comme ça », « tu as oublié ») | Un hook si ça doit arriver à chaque fois, sinon une ligne dans CLAUDE.md |
| Un commit de correction juste après un oubli (tests, lint, version) | Un hook (`PostToolUse` ou `Stop`) |
| Une tâche qui lit beaucoup pour une réponse courte, ou une relecture qui revient | Un sous-agent |
| Des commandes sans risque lancées souvent | Des permissions `allow`, ou `/fewer-permission-prompts` |
| Un élément du projet utile ailleurs | Le remonter dans le plugin hugo-fy |
| Un skill, un agent ou un plugin jamais utilisé | Le supprimer ou le désactiver : il coûte du contexte à chaque session |
| Une règle de CLAUDE.md que le code contredit | La corriger, avec l'aide de `claude-md-management:claude-md-improver` |

## Déroulé

1. **Lire.** Parcours la matière première, puis la configuration actuelle pour ne proposer aucun doublon : CLAUDE.md, `.claude/` (skills, agents, `settings.json`) et le contenu du kit (`claude plugin details hugo-fy`). Pour examiner une session en détail, confie la lecture à un sous-agent : les fichiers de session sont volumineux.
2. **Proposer.** Au plus sept propositions, classées par gain, dans un tableau avec, pour chacune :
   - le type ;
   - la preuve : une citation ou un chiffre tiré de la matière première ;
   - le gain attendu ;
   - le coût en contexte : permanent, ou seulement à l'utilisation ;
   - l'effort.

   Si rien ne mérite d'être automatisé, dis-le : on ne crée pas pour créer.
3. **Demander** lesquelles appliquer, et n'appliquer que celles-là. En mode non interactif, arrête-toi après les propositions.
4. **Appliquer.**
   - Un skill suit les conventions du kit : une description précise, des fiches annexes pour le détail, et `disable-model-invocation: true` s'il a des effets de bord.
   - Un hook suit [../demarrer-projet/references/reglages.md](../demarrer-projet/references/reglages.md).
   - Chaque ajout est vérifié par un essai réel.
5. **Conclure.** Indique la date du bilan et ce qui a changé, puis propose un message de commit. Pour une vue d'ensemble de tous les projets, suggère `/insights`.
