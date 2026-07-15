import { z } from "zod";
import { MAX_MONTANT } from "./common";

export const soldeBancaireFormSchema = z.object({
  soldeBancaire: z
    .string()
    .trim()
    .min(1, "Le solde bancaire est requis")
    .refine((value) => !Number.isNaN(Number(value)), "Montant invalide")
    .refine((value) => Number(value) >= 0, "Le solde bancaire ne peut pas être négatif")
    .refine((value) => Number(value) <= MAX_MONTANT, "Le montant est trop élevé"),
});

export type SoldeBancaireFormValues = z.infer<typeof soldeBancaireFormSchema>;
