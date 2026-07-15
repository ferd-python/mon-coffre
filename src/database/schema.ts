import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull().unique(),
  description: text("description"),
  couleur: text("couleur"),
  icone: text("icone"),
  ordre: integer("ordre").notNull().default(0),
  actif: integer("actif", { mode: "boolean" }).notNull().default(true),
  dateCreation: text("date_creation")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  dateModification: text("date_modification")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categorieId: integer("categorie_id")
    .notNull()
    .references(() => categories.id),
  type: text("type", { enum: ["ENTREE", "SORTIE"] }).notNull(),
  montant: real("montant").notNull(),
  description: text("description"),
  dateOperation: text("date_operation")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  dateCreation: text("date_creation")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const parametres = sqliteTable("parametres", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  soldeBancaire: real("solde_bancaire").notNull().default(0),
  dateModification: text("date_modification")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const cotisationsEglise = sqliteTable("cotisations_eglise", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  seme: real("seme").notNull().default(0),
  funerailles: real("funerailles").notNull().default(0),
  commentaire: text("commentaire"),
  dateCreation: text("date_creation")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  categorie: one(categories, {
    fields: [transactions.categorieId],
    references: [categories.id],
  }),
}));
