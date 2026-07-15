import { asc, count, eq } from "drizzle-orm";
import type { AppDatabase } from "@/database/client";
import { categories } from "@/database/schema";
import type { Category, NewCategory } from "@/types";

export class CategoryRepository {
  constructor(private readonly db: AppDatabase) {}

  findAll(): Promise<Category[]> {
    return this.db.select().from(categories).orderBy(asc(categories.ordre));
  }

  async findById(id: number): Promise<Category | undefined> {
    const [row] = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return row;
  }

  async create(data: NewCategory): Promise<Category> {
    const [row] = await this.db.insert(categories).values(data).returning();
    return row;
  }

  async update(
    id: number,
    data: Partial<NewCategory>,
  ): Promise<Category | undefined> {
    const [row] = await this.db
      .update(categories)
      .set({ ...data, dateModification: new Date().toISOString() })
      .where(eq(categories.id, id))
      .returning();
    return row;
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(categories).where(eq(categories.id, id));
  }

  async count(): Promise<number> {
    const [row] = await this.db.select({ value: count() }).from(categories);
    return row?.value ?? 0;
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(categories);
  }

  async insertMany(rows: NewCategory[]): Promise<void> {
    if (rows.length === 0) return;
    await this.db.insert(categories).values(rows);
  }
}
