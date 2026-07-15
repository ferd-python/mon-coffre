import { z } from "zod";

export const nonEmptyStringSchema = z.string().trim().min(1, "Ce champ est requis");

export const transactionTypeSchema = z.enum(["ENTREE", "SORTIE"]);

export const MAX_MONTANT = 999_999_999_999;

export const dateStringSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (AAAA-MM-JJ)")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, "Cette date n'existe pas");
