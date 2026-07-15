import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/database/client";
import { parametres } from "@/database/schema";
import type { Parametres } from "@/types";

export class SettingsRepository {
  constructor(private readonly db: AppDatabase) {}

  async find(): Promise<Parametres | undefined> {
    const [row] = await this.db.select().from(parametres);
    return row;
  }

  async create(soldeBancaire: number): Promise<Parametres> {
    const [row] = await this.db.insert(parametres).values({ soldeBancaire }).returning();
    return row;
  }

  async update(id: number, soldeBancaire: number): Promise<Parametres | undefined> {
    const [row] = await this.db
      .update(parametres)
      .set({ soldeBancaire, dateModification: new Date().toISOString() })
      .where(eq(parametres.id, id))
      .returning();
    return row;
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(parametres);
  }
}
