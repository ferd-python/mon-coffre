import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/database/client";
import { categories } from "@/database/schema";

export function useCategoriesQuery() {
  return useLiveQuery(db.select().from(categories).orderBy(asc(categories.ordre), asc(categories.id)));
}
