import { desc, eq } from "drizzle-orm";
import type { AppDatabase } from "@/database/client";
import { transactions } from "@/database/schema";
import type { NewTransaction, Transaction } from "@/types";

export class TransactionRepository {
  constructor(private readonly db: AppDatabase) {}

  findAll(): Promise<Transaction[]> {
    return this.db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.dateOperation));
  }

  async findById(id: number): Promise<Transaction | undefined> {
    const [row] = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return row;
  }

  async create(data: NewTransaction): Promise<Transaction> {
    const [row] = await this.db.insert(transactions).values(data).returning();
    return row;
  }

  async update(
    id: number,
    data: Partial<NewTransaction>,
  ): Promise<Transaction | undefined> {
    const [row] = await this.db
      .update(transactions)
      .set(data)
      .where(eq(transactions.id, id))
      .returning();
    return row;
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(transactions).where(eq(transactions.id, id));
  }

  async deleteAll(): Promise<void> {
    await this.db.delete(transactions);
  }

  async insertMany(rows: NewTransaction[]): Promise<void> {
    if (rows.length === 0) return;
    await this.db.insert(transactions).values(rows);
  }
}
