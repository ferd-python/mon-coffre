import { desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/database/client";
import { cotisationsEglise } from "@/database/schema";

export function useChurchContributionsQuery() {
  return useLiveQuery(
    db.select().from(cotisationsEglise).orderBy(desc(cotisationsEglise.date), desc(cotisationsEglise.id)),
  );
}
