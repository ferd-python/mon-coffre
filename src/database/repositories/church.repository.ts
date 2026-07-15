import { desc, eq } from "drizzle-orm";
import type { AppDatabase } from "@/database/client";
import { cotisationsEglise } from "@/database/schema";
import type { ChurchContribution, NewChurchContribution } from "@/types";

export class ChurchRepository {
  constructor(private readonly db: AppDatabase) {}

  findAll(): Promise<ChurchContribution[]> {
    return this.db
      .select()
      .from(cotisationsEglise)
      .orderBy(desc(cotisationsEglise.date));
  }

  async findById(id: number): Promise<ChurchContribution | undefined> {
    const [row] = await this.db
      .select()
      .from(cotisationsEglise)
      .where(eq(cotisationsEglise.id, id));
    return row;
  }

  async create(
    data: NewChurchContribution,
  ): Promise<ChurchContribution> {
    const [row] = await this.db
      .insert(cotisationsEglise)
      .values(data)
      .returning();
    return row;
  }

  async update(
    id: number,
    data: Partial<NewChurchContribution>,
  ): Promise<ChurchContribution | undefined> {
    const [row] = await this.db
      .update(cotisationsEglise)
      .set(data)
      .where(eq(cotisationsEglise.id, id))
      .returning();
    return row;
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(cotisationsEglise).where(eq(cotisationsEglise.id, id));
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(cotisationsEglise);
  }

  async insertMany(rows: NewChurchContribution[]): Promise<void> {
    if (rows.length === 0) return;
    await this.db.insert(cotisationsEglise).values(rows);
  }
}
