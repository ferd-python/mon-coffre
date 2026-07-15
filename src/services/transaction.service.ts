import { TransactionRepository } from "@/database/repositories";
import type { AppDatabase } from "@/database/client";
import type { NewTransaction, Transaction } from "@/types";

export class TransactionService {
  private readonly repository: TransactionRepository;

  constructor(db: AppDatabase) {
    this.repository = new TransactionRepository(db);
  }

  getAll(): Promise<Transaction[]> {
    return this.repository.findAll();
  }

  getById(id: number): Promise<Transaction | undefined> {
    return this.repository.findById(id);
  }

  create(data: NewTransaction): Promise<Transaction> {
    return this.repository.create(data);
  }

  update(
    id: number,
    data: Partial<NewTransaction>,
  ): Promise<Transaction | undefined> {
    return this.repository.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
