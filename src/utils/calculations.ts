import type { IconName } from "@/components/ui";
import type { TimelineItemData } from "@/components/cards";
import type { Category, ChurchContribution, Transaction } from "@/types";
import { CHURCH_CATEGORY_NAME } from "@/constants/categories";
import { formatFCFA } from "./formatFCFA";

export interface CategoryWithStats extends Category {
  solde: number;
  nombreTransactions: number;
}

export interface TransactionWithCategory extends Transaction {
  categorieNom: string;
  categorieCouleur: string;
  categorieIcone: IconName;
}

const FALLBACK_ICON: IconName = "help-circle-outline";

export function computeCategoriesWithStats(
  categories: Category[],
  transactions: Transaction[],
  churchContributions: ChurchContribution[] = [],
): CategoryWithStats[] {
  const churchTotal = churchContributions.reduce(
    (total, contribution) => total + contribution.seme + contribution.funerailles,
    0,
  );
  const churchCount = churchContributions.length;

  return categories.map((category) => {
    const categoryTransactions = transactions.filter(
      (transaction) => transaction.categorieId === category.id,
    );
    let solde = categoryTransactions.reduce(
      (total, transaction) =>
        total + (transaction.type === "ENTREE" ? transaction.montant : -transaction.montant),
      0,
    );
    let nombreTransactions = categoryTransactions.length;

    if (category.nom === CHURCH_CATEGORY_NAME) {
      solde += churchTotal;
      nombreTransactions += churchCount;
    }

    return {
      ...category,
      solde,
      nombreTransactions,
    };
  });
}

export function computeTransactionsWithCategory(
  transactions: Transaction[],
  categories: Category[],
): TransactionWithCategory[] {
  return transactions.map((transaction) => {
    const category = categories.find((item) => item.id === transaction.categorieId);
    return {
      ...transaction,
      categorieNom: category?.nom ?? "Catégorie supprimée",
      categorieCouleur: category?.couleur ?? "#6b7280",
      categorieIcone: (category?.icone as IconName | undefined) ?? FALLBACK_ICON,
    };
  });
}

export interface DashboardSummary {
  soldeGlobal: number;
  totalEglise: number;
  nombreCategories: number;
  nombreTransactions: number;
}

export function computeDashboardSummary(
  categories: CategoryWithStats[],
  transactionsCount: number,
  churchContributions: ChurchContribution[],
): DashboardSummary {
  const soldeGlobal = categories.reduce((total, category) => total + category.solde, 0);
  const totalEglise = churchContributions.reduce(
    (total, contribution) => total + contribution.seme + contribution.funerailles,
    0,
  );
  return {
    soldeGlobal,
    totalEglise,
    nombreCategories: categories.length,
    nombreTransactions: transactionsCount,
  };
}

export function computeTimeline(
  transactions: TransactionWithCategory[],
  churchContributions: ChurchContribution[],
): TimelineItemData[] {
  const transactionItems: TimelineItemData[] = transactions.map((transaction) => ({
    id: `transaction-${transaction.id}`,
    date: transaction.dateOperation,
    title: transaction.description?.trim() || (transaction.type === "ENTREE" ? "Entrée" : "Sortie"),
    description: `${transaction.type === "ENTREE" ? "Entrée" : "Sortie"} de ${formatFCFA(transaction.montant)} • ${transaction.categorieNom}`,
    icon: transaction.type === "ENTREE" ? "arrow-down-outline" : "arrow-up-outline",
    accent: transaction.type === "ENTREE" ? "success" : "danger",
  }));

  const churchItems: TimelineItemData[] = churchContributions.map((contribution) => ({
    id: `church-${contribution.id}`,
    date: contribution.date,
    title: "Cotisation église",
    description: `Sème ${formatFCFA(contribution.seme)} • Funérailles ${formatFCFA(contribution.funerailles)}`,
    icon: "business-outline",
    accent: "primary",
  }));

  return [...transactionItems, ...churchItems].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

function getMonthKey(dateValue: string): string {
  return dateValue.slice(0, 7);
}

export interface Statistics {
  moyenneMensuelle: number | null;
  categorieActive: CategoryWithStats | null;
  ceMoisCi: number | null;
  tauxEpargne: number | null;
  totalIncome: number;
  totalExpense: number;
}

export function computeStatistics(
  transactions: TransactionWithCategory[],
  categories: CategoryWithStats[],
  now: Date = new Date(),
): Statistics {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "ENTREE")
    .reduce((total, transaction) => total + transaction.montant, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "SORTIE")
    .reduce((total, transaction) => total + transaction.montant, 0);

  const monthKeys = new Set(transactions.map((transaction) => getMonthKey(transaction.dateOperation)));
  const moyenneMensuelle = monthKeys.size > 0 ? (totalIncome - totalExpense) / monthKeys.size : null;

  const categorieActive = categories.reduce<CategoryWithStats | null>((mostActive, category) => {
    if (category.nombreTransactions === 0) return mostActive;
    if (!mostActive || category.nombreTransactions > mostActive.nombreTransactions) {
      return category;
    }
    return mostActive;
  }, null);

  const currentMonthKey = getMonthKey(now.toISOString());
  const ceMoisCi = transactions
    .filter((transaction) => getMonthKey(transaction.dateOperation) === currentMonthKey)
    .reduce(
      (total, transaction) =>
        total + (transaction.type === "ENTREE" ? transaction.montant : -transaction.montant),
      0,
    );

  const tauxEpargne = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : null;

  return {
    moyenneMensuelle,
    categorieActive,
    ceMoisCi: monthKeys.has(currentMonthKey) ? ceMoisCi : null,
    tauxEpargne,
    totalIncome,
    totalExpense,
  };
}

export type ChurchPeriodFilter = "SEMAINE" | "MOIS" | "ANNEE" | "TOUT";

function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
}

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterContributionsByPeriod(
  contributions: ChurchContribution[],
  period: ChurchPeriodFilter,
  now: Date = new Date(),
): ChurchContribution[] {
  if (period === "TOUT") return contributions;

  if (period === "SEMAINE") {
    const startOfWeek = toDateString(getStartOfWeek(now));
    const today = toDateString(now);
    return contributions.filter((c) => c.date >= startOfWeek && c.date <= today);
  }

  if (period === "MOIS") {
    const monthKey = getMonthKey(now.toISOString());
    return contributions.filter((c) => getMonthKey(c.date) === monthKey);
  }

  const yearKey = String(now.getFullYear());
  return contributions.filter((c) => c.date.slice(0, 4) === yearKey);
}

export interface ChurchStatistics {
  totalSeme: number;
  totalFunerailles: number;
  totalGeneral: number;
  nombreDimanches: number;
  derniereCotisation: ChurchContribution | null;
  totalAnnuel: number;
  totalMensuel: number;
  moyenneParDimanche: number | null;
  plusGrosseCotisation: ChurchContribution | null;
}

export function computeChurchStatistics(
  contributions: ChurchContribution[],
  now: Date = new Date(),
): ChurchStatistics {
  const totalSeme = contributions.reduce((total, c) => total + c.seme, 0);
  const totalFunerailles = contributions.reduce((total, c) => total + c.funerailles, 0);
  const totalGeneral = totalSeme + totalFunerailles;
  const nombreDimanches = contributions.length;

  const derniereCotisation = contributions.reduce<ChurchContribution | null>((latest, c) => {
    if (!latest || c.date > latest.date) return c;
    return latest;
  }, null);

  const totalAnnuel = filterContributionsByPeriod(contributions, "ANNEE", now).reduce(
    (total, c) => total + c.seme + c.funerailles,
    0,
  );
  const totalMensuel = filterContributionsByPeriod(contributions, "MOIS", now).reduce(
    (total, c) => total + c.seme + c.funerailles,
    0,
  );

  const moyenneParDimanche = nombreDimanches > 0 ? totalGeneral / nombreDimanches : null;

  const plusGrosseCotisation = contributions.reduce<ChurchContribution | null>((biggest, c) => {
    const amount = c.seme + c.funerailles;
    const biggestAmount = biggest ? biggest.seme + biggest.funerailles : -1;
    return amount > biggestAmount ? c : biggest;
  }, null);

  return {
    totalSeme,
    totalFunerailles,
    totalGeneral,
    nombreDimanches,
    derniereCotisation,
    totalAnnuel,
    totalMensuel,
    moyenneParDimanche,
    plusGrosseCotisation,
  };
}
