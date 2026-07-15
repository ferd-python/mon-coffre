# Feuille de route — Mon Coffre

Ce document liste des pistes d'évolution envisageables pour les prochaines versions. Aucun élément listé ici n'est implémenté dans la version 1.0.0 : il s'agit d'idées à évaluer, pas d'engagements.

## Version 1.0.0 (actuelle)

Voir [CHANGELOG.md](./CHANGELOG.md) pour le détail complet des fonctionnalités livrées.

## Pistes envisagées pour une future version 1.x

### Statistiques et visualisation

- Graphiques (entrées / sorties par mois, répartition par catégorie) sur l'écran Statistiques, dont les emplacements sont déjà préparés dans l'interface actuelle.
- Export des statistiques au format PDF ou image.

### Catégories et transactions

- Personnalisation de l'icône et de la couleur d'une catégorie directement depuis le formulaire.
- Transactions récurrentes (ex. salaire mensuel, abonnement).
- Pièces jointes ou photos de reçus associées à une transaction.

### Église

- Génération d'un reçu de cotisation imprimable ou partageable.
- Historique comparatif d'une année sur l'autre.

### Sauvegarde et synchronisation

- Sauvegarde automatique planifiée (ex. hebdomadaire) vers un espace de stockage choisi par l'utilisateur.
- Synchronisation optionnelle entre plusieurs appareils (nécessiterait un choix explicite de l'utilisateur, l'application restant hors-ligne par défaut).

### Accessibilité et confort d'usage

- Mode sombre.
- Choix de la devise et de la langue.
- Widget d'accès rapide au solde global.

### Sécurité

- Verrouillage automatique après une durée d'inactivité configurable.
- Journal des accès (dates d'ouverture de l'application).

## Principe directeur

Toute nouvelle fonctionnalité devra continuer à respecter les principes fondateurs du projet : données locales uniquement, aucune dépendance payante, aucun serveur, et une expérience simple et rapide au quotidien.
