# Modèle de CLAUDE.md

But : dire à Claude ce qu'il ne peut pas deviner en lisant le code, en moins de 80 lignes. Ce fichier est chargé à chaque session : chaque ligne a un coût.

```markdown
# <Nom du projet>

<Une ou deux phrases : ce que fait le projet, pour qui, sur quelles plateformes.>

## Commandes

- `<commande>` : <rôle>
- Avant de considérer une modification comme terminée : `<vérification complète>`

## Architecture

- `<dossier>/` : <rôle, et ce qu'il a le droit d'importer>

## Règles

- <Convention ou piège non évident, avec sa raison.>

## Git

- <Convention de commit, branches, ce que déclenche un push.>
```

## À mettre

- Les commandes exactes, et la vérification complète à lancer avant de dire « fini ».
- L'architecture, à raison d'une ligne par dossier important.
- Les règles non évidentes, avec leur raison. Exemple tiré de NutriTrack : « modifier le seed impose d'incrémenter `SEED_VERSION`, sinon les téléphones déjà installés ne voient pas le changement ».
- Ce que déclenche un push : CI, déploiement, build d'une application.

## À ne pas mettre

- Les préférences personnelles : elles sont dans `~/.claude/CLAUDE.md`.
- Ce que le code montre déjà clairement.
- Les procédures longues : elles vont dans un skill.
- Les secrets.

Langue : celle du projet.
