import { z } from "zod";
import { MAX_MONTANT, dateStringSchema } from "./common";

const nonNegativeAmountString = z
  .string()
  .trim()
  .refine((value) => value === "" || !Number.isNaN(Number(value)), "Montant invalide")
  .refine((value) => value === "" || Number(value) >= 0, "Le montant ne peut pas être négatif")
  .refine((value) => value === "" || Number(value) <= MAX_MONTANT, "Le montant est trop élevé");

export const churchContributionFormSchema = z
  .object({
    date: dateStringSchema,
    seme: nonNegativeAmountString,
    funerailles: nonNegativeAmountString,
    commentaire: z.string().trim().max(200, "200 caractères maximum").optional(),
  })
  .refine((values) => Number(values.seme || 0) > 0 || Number(values.funerailles || 0) > 0, {
    message: "Renseignez au moins un montant (sème ou funérailles)",
    path: ["seme"],
  });

export type ChurchContributionFormValues = z.infer<typeof churchContributionFormSchema>;
