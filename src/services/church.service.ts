import { ChurchRepository } from "@/database/repositories";
import type { AppDatabase } from "@/database/client";
import type { ChurchContribution, NewChurchContribution } from "@/types";

export class ChurchService {
  private readonly repository: ChurchRepository;

  constructor(db: AppDatabase) {
    this.repository = new ChurchRepository(db);
  }

  getAll(): Promise<ChurchContribution[]> {
    return this.repository.findAll();
  }

  getById(id: number): Promise<ChurchContribution | undefined> {
    return this.repository.findById(id);
  }

  create(data: NewChurchContribution): Promise<ChurchContribution> {
    return this.repository.create(data);
  }

  update(
    id: number,
    data: Partial<NewChurchContribution>,
  ): Promise<ChurchContribution | undefined> {
    return this.repository.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
