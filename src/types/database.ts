import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { categories, transactions, cotisationsEglise, parametres } from "@/database/schema";

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
export type TransactionType = Transaction["type"];

export type ChurchContribution = InferSelectModel<typeof cotisationsEglise>;
export type NewChurchContribution = InferInsertModel<typeof cotisationsEglise>;

export type Parametres = InferSelectModel<typeof parametres>;
export type NewParametres = InferInsertModel<typeof parametres>;
