import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import {
  CategoryRepository,
  TransactionRepository,
  ChurchRepository,
  SettingsRepository,
} from "@/database/repositories";
import type { AppDatabase } from "@/database/client";
import { backupSchema, type BackupData } from "@/schemas/backup.schema";
import { CURRENCY_LABEL } from "@/constants/app";
import { CategoryService } from "./category.service";
import { SettingsService } from "./settings.service";
import type { Category, ChurchContribution, Transaction } from "@/types";

const BACKUP_VERSION = 1;

export interface BackupSummary {
  nombreCategories: number;
  nombreTransactions: number;
  nombreCotisations: number;
  dateExport: string;
}

export class BackupError extends Error {}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function generateBackupFileName(date: Date): string {
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timePart = `${pad(date.getHours())}-${pad(date.getMinutes())}`;
  return `MonCoffre_${datePart}_${timePart}.json`;
}

export class BackupService {
  private readonly categoryRepository: CategoryRepository;
  private readonly transactionRepository: TransactionRepository;
  private readonly churchRepository: ChurchRepository;
  private readonly settingsRepository: SettingsRepository;
  private readonly categoryService: CategoryService;
  private readonly settingsService: SettingsService;

  constructor(db: AppDatabase) {
    this.categoryRepository = new CategoryRepository(db);
    this.transactionRepository = new TransactionRepository(db);
    this.churchRepository = new ChurchRepository(db);
    this.settingsRepository = new SettingsRepository(db);
    this.categoryService = new CategoryService(db);
    this.settingsService = new SettingsService(db);
  }

  async buildBackup(): Promise<BackupData> {
    const [categoriesData, transactionsData, churchData, settings] = await Promise.all([
      this.categoryRepository.findAll(),
      this.transactionRepository.findAll(),
      this.churchRepository.findAll(),
      this.settingsRepository.find(),
    ]);

    return {
      version: BACKUP_VERSION,
      dateExport: new Date().toISOString(),
      categories: categoriesData,
      transactions: transactionsData,
      cotisationsEglise: churchData,
      parametres: { devise: CURRENCY_LABEL, soldeBancaire: settings?.soldeBancaire ?? 0 },
    };
  }

  async createBackupFile(): Promise<{ file: File; fileName: string; data: BackupData }> {
    const data = await this.buildBackup();
    const fileName = generateBackupFileName(new Date(data.dateExport));

    const directory = new Directory(Paths.document, "backups");
    if (!directory.exists) {
      directory.create({ intermediates: true });
    }

    const file = new File(directory, fileName);
    if (file.exists) {
      file.delete();
    }
    file.create();
    file.write(JSON.stringify(data, null, 2));

    return { file, fileName, data };
  }

  async shareBackup(): Promise<void> {
    const { file } = await this.createBackupFile();
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new BackupError("Le partage de fichiers n'est pas disponible sur cet appareil.");
    }
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/json",
      dialogTitle: "Partager la sauvegarde Mon Coffre",
    });
  }

  async pickBackupFile(): Promise<{ data: BackupData; summary: BackupSummary } | null> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled || result.assets.length === 0) {
      return null;
    }

    let content: string;
    try {
      const pickedFile = new File(result.assets[0].uri);
      content = await pickedFile.text();
    } catch {
      throw new BackupError("Impossible de lire le fichier sélectionné.");
    }

    const data = this.parseBackup(content);
    return {
      data,
      summary: {
        nombreCategories: data.categories.length,
        nombreTransactions: data.transactions.length,
        nombreCotisations: data.cotisationsEglise.length,
        dateExport: data.dateExport,
      },
    };
  }

  parseBackup(content: string): BackupData {
    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      throw new BackupError("Le fichier sélectionné n'est pas un fichier JSON valide.");
    }

    const result = backupSchema.safeParse(json);
    if (!result.success) {
      throw new BackupError("Ce fichier ne correspond pas à une sauvegarde Mon Coffre valide.");
    }
    return result.data;
  }

  async restoreBackup(data: BackupData): Promise<void> {
    const snapshot = {
      categories: await this.categoryRepository.findAll(),
      transactions: await this.transactionRepository.findAll(),
      church: await this.churchRepository.findAll(),
      soldeBancaire: (await this.settingsRepository.find())?.soldeBancaire ?? 0,
    };

    try {
      await this.replaceAllData(
        data.categories,
        data.transactions,
        data.cotisationsEglise,
        data.parametres.soldeBancaire,
      );
    } catch {
      await this.restoreSnapshot(snapshot);
      throw new BackupError("La restauration a échoué. Vos données existantes ont été conservées.");
    }
  }

  async resetAllData(): Promise<void> {
    await this.transactionRepository.deleteAll();
    await this.churchRepository.deleteAll();
    await this.categoryRepository.deleteAll();
    await this.categoryService.seedDefaultCategories();
    await this.settingsService.resetSoldeBancaire();
  }

  private async replaceAllData(
    categoriesData: Category[],
    transactionsData: Transaction[],
    churchData: ChurchContribution[],
    soldeBancaire: number,
  ): Promise<void> {
    await this.transactionRepository.deleteAll();
    await this.churchRepository.deleteAll();
    await this.categoryRepository.deleteAll();

    await this.categoryRepository.insertMany(categoriesData);
    await this.transactionRepository.insertMany(transactionsData);
    await this.churchRepository.insertMany(churchData);
    await this.settingsService.updateSoldeBancaire(soldeBancaire);
  }

  private async restoreSnapshot(snapshot: {
    categories: Category[];
    transactions: Transaction[];
    church: ChurchContribution[];
    soldeBancaire: number;
  }): Promise<void> {
    try {
      await this.replaceAllData(
        snapshot.categories,
        snapshot.transactions,
        snapshot.church,
        snapshot.soldeBancaire,
      );
    } catch {
      // The snapshot restore itself failed; nothing more can be safely attempted here.
    }
  }
}
