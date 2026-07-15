import { z } from "zod";
import { nonEmptyStringSchema } from "./common";

export const categoryFormSchema = z.object({
  nom: nonEmptyStringSchema.max(50, "50 caractères maximum"),
  description: z.string().trim().max(200, "200 caractères maximum").optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
