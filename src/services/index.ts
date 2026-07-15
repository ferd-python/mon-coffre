import { db } from "@/database/client";
import { CategoryService } from "./category.service";
import { TransactionService } from "./transaction.service";
import { ChurchService } from "./church.service";
import { BackupService } from "./backup.service";

export const categoryService = new CategoryService(db);
export const transactionService = new TransactionService(db);
export const churchService = new ChurchService(db);
export const backupService = new BackupService(db);

export * from "./category.service";
export * from "./transaction.service";
export * from "./church.service";
export * from "./backup.service";
