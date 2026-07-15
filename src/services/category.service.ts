import { CategoryRepository } from "@/database/repositories";
import type { AppDatabase } from "@/database/client";
import { DEFAULT_CATEGORY_NAMES } from "@/constants/categories";
import type { Category, NewCategory } from "@/types";

const COLOR_PALETTE = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];
const DEFAULT_ICON = "pricetag-outline";

const DEFAULT_CATEGORY_APPEARANCE: Record<string, { icone: string; couleur: string }> = {
  Personnel: { icone: "person-outline", couleur: "#2563eb" },
  Papa: { icone: "man-outline", couleur: "#16a34a" },
  Église: { icone: "business-outline", couleur: "#d97706" },
  Autres: { icone: "ellipsis-horizontal-outline", couleur: "#6b7280" },
};

export class CategoryService {
  private readonly repository: CategoryRepository;

  constructor(db: AppDatabase) {
    this.repository = new CategoryRepository(db);
  }

  getAll(): Promise<Category[]> {
    return this.repository.findAll();
  }

  getById(id: number): Promise<Category | undefined> {
    return this.repository.findById(id);
  }

  async create(data: NewCategory): Promise<Category> {
    const count = await this.repository.count();
    const payload: NewCategory = {
      ...data,
      couleur: data.couleur ?? COLOR_PALETTE[count % COLOR_PALETTE.length],
      icone: data.icone ?? DEFAULT_ICON,
    };
    return this.repository.create(payload);
  }

  update(id: number, data: Partial<NewCategory>): Promise<Category | undefined> {
    return this.repository.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async seedDefaultCategories(): Promise<void> {
    const existing = await this.repository.findAll();
    const existingNames = new Set(existing.map((category) => category.nom));

    for (const [index, nom] of DEFAULT_CATEGORY_NAMES.entries()) {
      if (!existingNames.has(nom)) {
        const appearance = DEFAULT_CATEGORY_APPEARANCE[nom];
        await this.repository.create({
          nom,
          ordre: index,
          actif: true,
          icone: appearance?.icone,
          couleur: appearance?.couleur,
        });
      }
    }
  }
}
