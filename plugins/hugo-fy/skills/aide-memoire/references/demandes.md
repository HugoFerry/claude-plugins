# Formuler une demande

## L'essentiel

- **Le but et sa raison**, pas seulement la tâche : « je veux suivre mes fibres semaine par semaine » plutôt que « ajoute un graphique ».
- **Un critère de fin vérifiable :** « les tests passent et le graphique s'affiche sur mobile ».
- **Le contexte que Claude ne peut pas deviner :** contraintes, décisions déjà prises, ce qui a été essayé.
- **Pour une grosse tâche, un plan d'abord**, validé avant de toucher au code.
- **Les moyens de vérifier :** tests, commande à lancer, capture d'écran du résultat attendu.
- **Une tâche par session**, avec `/clear` entre deux sujets sans rapport.
- **Montrer plutôt que décrire :** une capture d'écran, un fichier cité, le message d'erreur complet.
- **Interrompre tôt** si Claude part dans la mauvaise direction.

## Pour aller plus loin

### Modèles

Nouvelle fonctionnalité :
```
Je veux <résultat pour l'utilisateur> parce que <raison>.
Contraintes : <…>.
C'est fini quand : <tests, comportement visible>.
Commence par un plan et attends mon accord.
```

Bug :
```
Symptôme : <ce que je vois>. Attendu : <ce que je devrais voir>.
Pour reproduire : <étapes>. Erreur complète : <copie>.
Trouve la cause avant de corriger, puis ajoute un test qui échouait avant la correction.
```

Comprendre du code :
```
Explique-moi comment <partie du code> fonctionne, avec les fichiers clés, sans rien modifier.
```

Relecture :
```
Fais relire <changement> par un sous-agent qui ne l'a pas écrit, et classe les problèmes par gravité.
```

### Réglages selon la tâche

- **Bug retors ou question d'architecture :** effort élevé, Opus, mode plan.
- **Retouche simple :** effort bas, ou Sonnet.
- **Longue session :** surveiller `/context`. Utiliser `/compact` en disant quoi garder, ou `/clear` pour repartir d'un résumé.
