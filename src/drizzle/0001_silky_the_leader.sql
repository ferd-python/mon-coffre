CREATE TABLE `parametres` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`solde_bancaire` real DEFAULT 0 NOT NULL,
	`date_modification` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
