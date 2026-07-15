import { desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/database/client";
import { transactions } from "@/database/schema";

export function useTransactionsQuery() {
  return useLiveQuery(
    db.select().from(transactions).orderBy(desc(transactions.dateOperation), desc(transactions.id)),
  );
}
