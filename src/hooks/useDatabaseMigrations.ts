import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db } from "@/database/client";
import { migrations } from "@/database/migrations";

export function useDatabaseMigrations() {
  return useMigrations(db, migrations);
}
