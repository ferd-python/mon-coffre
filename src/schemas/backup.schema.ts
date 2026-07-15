import { z } from "zod";
import { transactionTypeSchema } from "./common";

const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

const categoryBackupSchema = z.object({
  id: z.number().int(),
  nom: z.string().min(1),
  description: nullableString,
  couleur: nullableString,
  icone: nullableString,
  ordre: z.number().int(),
  actif: z.boolean(),
  dateCreation: z.string(),
  dateModification: z.string(),
});

const transactionBackupSchema = z.object({
  id: z.number().int(),
  categorieId: z.number().int(),
  type: transactionTypeSchema,
  montant: z.number(),
  description: nullableString,
  dateOperation: z.string(),
  dateCreation: z.string(),
});

const churchContributionBackupSchema = z.object({
  id: z.number().int(),
  date: z.string(),
  seme: z.number(),
  funerailles: z.number(),
  commentaire: nullableString,
  dateCreation: z.string(),
});

export const backupSchema = z.object({
  version: z.number().int(),
  dateExport: z.string(),
  categories: z.array(categoryBackupSchema),
  transactions: z.array(transactionBackupSchema),
  cotisationsEglise: z.array(churchContributionBackupSchema),
  parametres: z.object({
    devise: z.string(),
    soldeBancaire: z.number().default(0),
  }),
});

export type BackupData = z.infer<typeof backupSchema>;
