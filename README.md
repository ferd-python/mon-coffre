# Mon Coffre

Application mobile Android de gestion financière familiale, permettant de suivre l'argent d'un même compte bancaire réparti entre plusieurs propriétaires (Personnel, Papa, Église, Autres, etc.), ainsi que les cotisations d'église (sème et funérailles).

Toutes les données sont stockées **localement** sur l'appareil (SQLite), sans aucun serveur ni compte à créer. L'application fonctionne entièrement hors-ligne.

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Lancement](#lancement)
- [Build Android](#build-android)
- [Sauvegarde et restauration](#sauvegarde-et-restauration)
- [Sécurité](#sécurité)
- [Architecture de la base de données](#architecture-de-la-base-de-données)
- [Qualité et vérifications](#qualité-et-vérifications)

## Présentation

Le principe de l'application : un même compte bancaire physique contient l'argent de plusieurs personnes ou usages ("catégories"). Chaque catégorie possède son propre solde, calculé automatiquement à partir des transactions qui lui sont associées. Le total de tous les soldes représente l'argent réellement présent sur le compte.

Un module dédié permet en complément de suivre les cotisations hebdomadaires de l'Église (sème et funérailles), dont le montant est automatiquement intégré au solde de la catégorie "Église".

## Fonctionnalités

- **Tableau de bord** : solde global, nombre de catégories, nombre de transactions, total Église, liste des catégories avec leur solde — tout se met à jour en temps réel.
- **Catégories** : création, modification, suppression, recherche, tri (ordre, nom, solde). Les noms en double sont interdits et la suppression d'une catégorie contenant des transactions est bloquée avec un message explicatif.
- **Transactions** : formulaire complet (catégorie, type entrée/sortie, montant, description, date), recherche, filtres (toutes / entrées / sorties), tri (date / montant), modification, suppression.
- **Église** : suivi des cotisations (sème, funérailles), totaux (sème, funérailles, général), nombre de dimanches enregistrés, dernière cotisation, statistiques (total annuel, total mensuel, moyenne par dimanche, plus grosse cotisation), recherche par date/commentaire, filtres par période (semaine, mois, année, tout).
- **Historique** : timeline chronologique fusionnant transactions et cotisations Église.
- **Statistiques** : moyenne mensuelle, catégorie la plus active, solde du mois en cours, taux d'épargne.
- **Paramètres** :
  - **Sauvegarde** : créer, restaurer, partager une sauvegarde JSON ; réinitialiser complètement l'application.
  - **Sécurité** : verrouillage par code PIN à 4 chiffres, déverrouillage biométrique (empreinte / reconnaissance faciale) en complément du PIN.
- Notifications visuelles (succès, erreur) pour chaque action importante.
- Interface entièrement réactive : toute modification (ajout, édition, suppression) met immédiatement à jour le Dashboard, l'Historique et les Statistiques, sans rechargement manuel.

## Technologies utilisées

| Domaine | Technologie |
| --- | --- |
| Framework mobile | [Expo](https://expo.dev) (SDK 57) + React Native |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (routing par fichiers) |
| Langage | TypeScript (mode strict) |
| Base de données | SQLite ([expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) (+ `useLiveQuery` pour la réactivité temps réel) |
| Style | [NativeWind](https://www.nativewind.dev/) (Tailwind CSS pour React Native) |
| Formulaires | [React Hook Form](https://react-hook-form.com/) |
| Validation | [Zod](https://zod.dev/) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Sauvegarde | expo-file-system, expo-sharing, expo-document-picker |
| Sécurité | expo-secure-store, expo-local-authentication |

## Structure du projet

```
mon-coffre/
├── app/                          # Écrans et navigation (Expo Router)
│   ├── _layout.tsx               # Layout racine : migrations, sécurité, providers
│   └── (tabs)/                   # Navigation par onglets
│       ├── index.tsx             # Dashboard
│       ├── categories.tsx
│       ├── transactions.tsx
│       ├── church.tsx            # Église
│       ├── history.tsx           # Historique
│       ├── statistics.tsx
│       └── settings.tsx          # Paramètres (sauvegarde, sécurité)
├── src/
│   ├── components/
│   │   ├── ui/                   # Composants génériques (AppButton, AppCard, Toast, PinScreen…)
│   │   ├── forms/                # Formulaires métier (CategoryFormModal, TransactionFormModal…)
│   │   └── cards/                # Cartes d'affichage (CategoryCard, TransactionCard…)
│   ├── database/
│   │   ├── schema.ts             # Schéma Drizzle (categories, transactions, cotisations_eglise)
│   │   ├── client.ts             # Connexion SQLite + instance Drizzle
│   │   └── repositories/         # Accès aux données (CRUD par table)
│   ├── services/                 # Logique métier (CategoryService, TransactionService, BackupService…)
│   ├── hooks/                    # Hooks React (live queries, calculs dérivés, sécurité)
│   ├── schemas/                  # Schémas de validation Zod
│   ├── utils/                    # Fonctions utilitaires pures (calculs, formatage)
│   ├── constants/                # Constantes de l'application
│   ├── theme/                    # Couleurs, typographie, espacements
│   ├── lib/                      # Intégrations transverses (toast, sécurité, animations)
│   ├── types/                    # Types TypeScript partagés
│   └── drizzle/                  # Migrations SQL générées
├── app.json                      # Configuration Expo
├── drizzle.config.ts             # Configuration Drizzle Kit
├── tailwind.config.js            # Configuration NativeWind/Tailwind
└── package.json
```

## Installation

Prérequis : [Node.js](https://nodejs.org/) 18 ou supérieur, npm, et l'application [Expo Go](https://expo.dev/go) (ou un émulateur Android) pour tester sur un appareil.

```bash
npm install
```

## Lancement

```bash
npm start          # démarre le serveur de développement Expo
npm run android     # démarre et ouvre directement sur un émulateur/appareil Android
```

Scannez le QR code affiché avec l'application Expo Go, ou lancez directement sur un émulateur Android déjà configuré.

## Build Android

Le projet est prêt pour une compilation Android via [EAS Build](https://docs.expo.dev/build/introduction/) :

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

Pour un build local de développement (APK installable directement) :

```bash
eas build --platform android --profile preview --local
```

Avant tout build de production, vérifiez qu'aucune erreur TypeScript n'est présente :

```bash
npm run typecheck
```

## Sauvegarde et restauration

Depuis **Paramètres → Sauvegarde** :

1. **Créer une sauvegarde** : génère un fichier JSON contenant l'intégralité des données (catégories, transactions, cotisations Église, paramètres non sensibles), nommé au format `MonCoffre_AAAA-MM-JJ_HH-mm.json`, stocké localement dans l'application.
2. **Partager une sauvegarde** : crée une sauvegarde à jour puis ouvre le menu de partage natif Android (email, cloud, messagerie…).
3. **Restaurer une sauvegarde** : sélectionnez un fichier `.json` précédemment exporté. Un résumé (nombre de catégories, transactions, cotisations, date d'export) s'affiche avant confirmation. La restauration **remplace entièrement** les données actuelles. En cas d'erreur (fichier invalide, corrompu), l'opération est annulée et les données existantes sont conservées intactes.
4. **Supprimer toutes les données** : réinitialise complètement l'application après double confirmation. Les catégories par défaut (Personnel, Papa, Église, Autres) sont automatiquement recréées.

Le code PIN et les préférences de sécurité ne sont **jamais** inclus dans une sauvegarde, pour des raisons de confidentialité.

## Sécurité

- Au premier lancement, l'application propose d'activer un code PIN à 4 chiffres.
- Si activé, le code est demandé à chaque ouverture de l'application.
- Le code PIN peut être modifié ou désactivé à tout moment depuis **Paramètres → Sécurité** (une nouvelle saisie du code actuel est requise).
- Si l'appareil prend en charge la biométrie (empreinte digitale ou reconnaissance faciale) et qu'elle est configurée sur le téléphone, elle peut être activée en complément du code PIN pour un déverrouillage plus rapide.
- Le code PIN est stocké de façon chiffrée via le stockage sécurisé natif d'Android (Keystore), jamais en clair, jamais synchronisé.

## Architecture de la base de données

Base SQLite locale, gérée par Drizzle ORM. Trois tables principales :

### `categories`

| Colonne | Type | Description |
| --- | --- | --- |
| `id` | integer (PK) | Identifiant auto-incrémenté |
| `nom` | text (unique) | Nom de la catégorie |
| `description` | text | Description optionnelle |
| `couleur` | text | Couleur d'affichage (hex) |
| `icone` | text | Nom de l'icône |
| `ordre` | integer | Ordre d'affichage manuel |
| `actif` | boolean | Catégorie active |
| `date_creation` / `date_modification` | text | Horodatages |

### `transactions`

| Colonne | Type | Description |
| --- | --- | --- |
| `id` | integer (PK) | Identifiant auto-incrémenté |
| `categorie_id` | integer (FK → categories.id) | Catégorie associée |
| `type` | text (`ENTREE` \| `SORTIE`) | Type d'opération |
| `montant` | real | Montant (toujours positif) |
| `description` | text | Description optionnelle |
| `date_operation` | text | Date de l'opération |
| `date_creation` | text | Horodatage de création |

### `cotisations_eglise`

| Colonne | Type | Description |
| --- | --- | --- |
| `id` | integer (PK) | Identifiant auto-incrémenté |
| `date` | text | Date de la cotisation |
| `seme` | real | Montant du sème (≥ 0) |
| `funerailles` | real | Montant des funérailles (≥ 0) |
| `commentaire` | text | Commentaire optionnel |
| `date_creation` | text | Horodatage de création |

> Le sème et les funérailles ne peuvent jamais être tous deux égaux à zéro pour une même cotisation.

Le module Église reste indépendant (table dédiée, aucune écriture croisée dans `transactions`) : le solde de la catégorie "Église" est calculé dynamiquement en additionnant ses transactions **et** l'ensemble des cotisations enregistrées, garantissant une synchronisation automatique et instantanée avec le Dashboard, l'Historique et les Statistiques.

Les migrations SQL sont générées par Drizzle Kit dans `src/drizzle/` :

```bash
npm run db:generate   # génère une nouvelle migration après modification du schéma
npm run db:studio     # explorateur visuel de la base de données (Drizzle Studio)
```

## Qualité et vérifications

```bash
npm run typecheck   # vérification TypeScript stricte (aucune erreur tolérée)
npx expo-doctor      # vérification de la configuration Expo et des dépendances
```

Le projet ne contient aucune donnée fictive : toutes les valeurs affichées proviennent de la base SQLite locale. Les catégories par défaut (Personnel, Papa, Église, Autres) sont créées automatiquement lors du tout premier lancement.
