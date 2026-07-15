import { SettingsRepository } from "@/database/repositories";
import type { AppDatabase } from "@/database/client";
import type { Parametres } from "@/types";

export class SettingsService {
  private readonly repository: SettingsRepository;

  constructor(db: AppDatabase) {
    this.repository = new SettingsRepository(db);
  }

  async ensureExists(): Promise<Parametres> {
    const existing = await this.repository.find();
    if (existing) return existing;
    return this.repository.create(0);
  }

  async updateSoldeBancaire(soldeBancaire: number): Promise<Parametres> {
    const existing = await this.repository.find();
    if (!existing) {
      return this.repository.create(soldeBancaire);
    }
    const updated = await this.repository.update(existing.id, soldeBancaire);
    return updated ?? existing;
  }

  async resetSoldeBancaire(): Promise<void> {
    await this.repository.deleteAll();
    await this.repository.create(0);
  }
}
