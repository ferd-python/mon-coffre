import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  AppEmptyState,
  AppFAB,
  AppHeader,
  AppSearchBar,
  ConfirmationDialog,
  Screen,
  Text,
} from "@/components/ui";
import { TransactionFormModal } from "@/components/forms";
import { TransactionCard, type TransactionCardData } from "@/components/cards";
import { useTransactionsWithCategory, type TransactionWithCategory } from "@/hooks/useTransactionsWithCategory";
import { transactionService } from "@/services";
import { useToast } from "@/lib/toast";
import { cn } from "@/utils/cn";

const FILTERS = [
  { key: "TOUS", label: "Tous" },
  { key: "ENTREE", label: "Entrées" },
  { key: "SORTIE", label: "Sorties" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const SORT_OPTIONS = [
  { key: "date", label: "Date" },
  { key: "montant", label: "Montant" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

function toCardData(transaction: TransactionWithCategory): TransactionCardData {
  return {
    id: transaction.id,
    type: transaction.type,
    montant: transaction.montant,
    description: transaction.description ?? "Sans description",
    categorieNom: transaction.categorieNom,
    date: transaction.dateOperation,
  };
}

export default function TransactionsScreen() {
  const { transactions } = useTransactionsWithCategory();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("TOUS");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionWithCategory | null>(null);

  const visibleTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = transactions.filter((transaction) => {
      const matchesFilter = filter === "TOUS" || transaction.type === filter;
      const matchesSearch =
        !term ||
        (transaction.description ?? "").toLowerCase().includes(term) ||
        transaction.categorieNom.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "montant") return b.montant - a.montant;
      return a.dateOperation < b.dateOperation ? 1 : a.dateOperation > b.dateOperation ? -1 : 0;
    });
  }, [transactions, search, filter, sortBy]);

  const openCreateForm = useCallback(() => {
    setEditingTransaction(null);
    setIsFormVisible(true);
  }, []);

  const openEditForm = useCallback((transaction: TransactionWithCategory) => {
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;
    try {
      await transactionService.delete(transactionToDelete.id);
      showToast("success", "Transaction supprimée avec succès");
    } catch {
      showToast("error", "Une erreur est survenue lors de la suppression.");
    }
    setTransactionToDelete(null);
  }, [transactionToDelete, showToast]);

  const renderItem = useCallback(
    ({ item, index }: { item: TransactionWithCategory; index: number }) => (
      <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 40).springify()}>
        <TransactionCard
          transaction={toCardData(item)}
          onEdit={() => openEditForm(item)}
          onDelete={() => setTransactionToDelete(item)}
        />
      </Animated.View>
    ),
    [openEditForm],
  );

  return (
    <Screen>
      <AppHeader title="Transactions" subtitle="Historique de vos opérations" />

      <FlatList
        data={visibleTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        contentContainerClassName="gap-3 px-5 pb-24"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-3">
            <AppSearchBar value={search} onChangeText={setSearch} />
            <View className="flex-row gap-2">
              {FILTERS.map((item) => {
                const isActive = filter === item.key;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrer : ${item.label}`}
                    accessibilityState={{ selected: isActive }}
                    onPress={() => setFilter(item.key)}
                    className={cn(
                      "rounded-full px-4 py-2",
                      isActive ? "bg-primary-600" : "bg-neutral-100",
                    )}
                  >
                    <Text
                      variant="caption"
                      className={cn("font-semibold", isActive ? "text-white" : "text-neutral-600")}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View className="flex-row items-center gap-2">
              <Text variant="caption">Trier par</Text>
              {SORT_OPTIONS.map((option) => {
                const isActive = sortBy === option.key;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityLabel={`Trier par ${option.label}`}
                    accessibilityState={{ selected: isActive }}
                    onPress={() => setSortBy(option.key)}
                    className={cn(
                      "rounded-full px-3 py-1.5",
                      isActive ? "bg-neutral-800" : "bg-neutral-100",
                    )}
                  >
                    <Text
                      variant="caption"
                      className={cn("font-semibold", isActive ? "text-white" : "text-neutral-600")}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <AppEmptyState
            icon="receipt-outline"
            title="Aucune transaction"
            message={
              search || filter !== "TOUS"
                ? "Aucun résultat pour ces critères."
                : "Les opérations que vous ajouterez apparaîtront ici."
            }
          />
        }
      />

      <AppFAB onPress={openCreateForm} />

      <TransactionFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        transaction={editingTransaction}
      />

      <ConfirmationDialog
        visible={transactionToDelete !== null}
        title="Supprimer la transaction"
        message={`Voulez-vous vraiment supprimer "${transactionToDelete?.description || "cette transaction"}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </Screen>
  );
}
