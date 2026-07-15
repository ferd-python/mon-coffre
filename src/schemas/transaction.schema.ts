import { z } from "zod";
import { MAX_MONTANT, dateStringSchema, transactionTypeSchema } from "./common";

export const transactionFormSchema = z.object({
  categorieId: z.number().int().positive("La catégorie est requise"),
  type: transactionTypeSchema,
  montant: z
    .string()
    .trim()
    .min(1, "Le montant est requis")
    .refine((value) => !Number.isNaN(Number(value)), "Montant invalide")
    .refine((value) => Number(value) > 0, "Le montant doit être supérieur à zéro")
    .refine((value) => Number(value) <= MAX_MONTANT, "Le montant est trop élevé"),
  description: z.string().trim().max(200, "200 caractères maximum").optional(),
  dateOperation: dateStringSchema,
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
