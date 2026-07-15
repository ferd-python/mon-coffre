CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`description` text,
	`couleur` text,
	`icone` text,
	`ordre` integer DEFAULT 0 NOT NULL,
	`actif` integer DEFAULT true NOT NULL,
	`date_creation` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`date_modification` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_nom_unique` ON `categories` (`nom`);--> statement-breakpoint
CREATE TABLE `cotisations_eglise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`seme` real DEFAULT 0 NOT NULL,
	`funerailles` real DEFAULT 0 NOT NULL,
	`commentaire` text,
	`date_creation` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categorie_id` integer NOT NULL,
	`type` text NOT NULL,
	`montant` real NOT NULL,
	`description` text,
	`date_operation` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`date_creation` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`categorie_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
