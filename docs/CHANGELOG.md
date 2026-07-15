# Changelog

Toutes les évolutions notables de "Mon Coffre" sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [1.0.0] - 2026-07-15

Première version stable, prête pour la production.

### Ajouté

- **Architecture** : projet Expo (SDK 57) + TypeScript strict, Expo Router, NativeWind, Drizzle ORM sur SQLite local, React Hook Form + Zod.
- **Base de données** : tables `categories`, `transactions`, `cotisations_eglise` ; repositories et services applicatifs ; initialisation automatique des catégories par défaut (Personnel, Papa, Église, Autres) au premier lancement.
- **Interface complète** : Dashboard, Catégories, Transactions, Église, Historique, Statistiques, Paramètres — navigation par onglets, design premium avec animations.
- **Fonctionnalités métier temps réel** :
  - Gestion des catégories (créer, modifier, supprimer, rechercher, trier) avec anti-doublon et protection contre la suppression d'une catégorie utilisée.
  - Gestion des transactions (créer, modifier, supprimer, rechercher, filtrer, trier) avec validation stricte (montant obligatoire et positif, date valide).
  - Module Église indépendant : cotisations (sème / funérailles), synchronisation automatique avec le solde de la catégorie "Église", statistiques dédiées (total annuel, mensuel, moyenne par dimanche, plus grosse cotisation), filtres par période.
  - Historique unifié (timeline) et statistiques globales (moyenne mensuelle, catégorie la plus active, taux d'épargne).
  - Synchronisation instantanée entre tous les écrans via les requêtes réactives Drizzle (`useLiveQuery`).
- **Sauvegarde et restauration** : export JSON complet, partage natif, restauration avec résumé et confirmation, restauration atomique avec conservation des données existantes en cas d'erreur, réinitialisation complète avec double confirmation.
- **Sécurité** : verrouillage par code PIN à 4 chiffres, déverrouillage biométrique complémentaire (empreinte / reconnaissance faciale), modification et désactivation du code PIN.
- **Notifications** : messages visuels (succès, erreur) pour toutes les actions importantes.
- **Accessibilité** : libellés sur tous les éléments interactifs, zones tactiles confortables, annonces pour lecteurs d'écran.
- **Documentation** : README complet (installation, build, architecture de la base de données, procédure de sauvegarde).

### Optimisé

- Suppression des souscriptions de requêtes redondantes (temps réel) et du code mort (services, composants et fichiers inutilisés).
- Mémoïsation des composants de liste et réglages `FlatList` pour de meilleures performances de défilement.
- Renforcement des schémas de validation (limites de longueur, dates calendaires réellement valides, montants plafonnés).

### Préparation production

- Icône et écran de démarrage personnalisés.
- Permissions Android réduites au strict nécessaire (stockage, biométrie).
- Configuration `eas.json` pour les builds de développement, prévisualisation et production.
