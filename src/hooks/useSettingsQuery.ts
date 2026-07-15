import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/database/client";
import { parametres } from "@/database/schema";

export function useSettingsQuery() {
  const { data, error, updatedAt } = useLiveQuery(db.select().from(parametres));
  const soldeBancaire = data[0]?.soldeBancaire ?? 0;
  return { soldeBancaire, error, updatedAt };
}
