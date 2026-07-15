import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  AppEmptyState,
  AppFAB,
  AppHeader,
  AppModal,
  AppSearchBar,
  ConfirmationDialog,
  Icon,
  Screen,
  Text,
} from "@/components/ui";
import { CategoryFormModal } from "@/components/forms";
import { CategoryCard, type CategoryCardData } from "@/components/cards";
import { useCategoriesWithStats, type CategoryWithStats } from "@/hooks/useCategoriesWithStats";
import { categoryService } from "@/services";
import { useToast } from "@/lib/toast";
import { cn } from "@/utils/cn";
import { isProtectedCategoryName } from "@/constants/categories";
import type { IconName } from "@/components/ui";

type SortKey = "ordre" | "nom" | "solde";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "ordre", label: "Ordre" },
  { key: "nom", label: "Nom" },
  { key: "solde", label: "Solde" },
];

function toCardData(category: CategoryWithStats): CategoryCardData {
  return {
    id: category.id,
    nom: category.nom,
    description: category.description ?? "",
    montant: category.solde,
    nombreTransactions: category.nombreTransactions,
    icone: (category.icone as IconName | null) ?? "pricetag-outline",
    couleur: category.couleur ?? "#6b7280",
  };
}

export default function CategoriesScreen() {
  const { categories } = useCategoriesWithStats();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("ordre");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithStats | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithStats | null>(null);
  const [blockedCategory, setBlockedCategory] = useState<CategoryWithStats | null>(null);

  const visibleCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = categories.filter(
      (category) =>
        !term ||
        category.nom.toLowerCase().includes(term) ||
        (category.description ?? "").toLowerCase().includes(term),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "nom") return a.nom.localeCompare(b.nom);
      if (sortBy === "solde") return b.solde - a.solde;
      return a.ordre - b.ordre;
    });
  }, [categories, search, sortBy]);

  const existingNames = useMemo(
    () =>
      categories
        .filter((category) => category.id !== editingCategory?.id)
        .map((category) => category.nom.trim().toLowerCase()),
    [categories, editingCategory],
  );

  const openCreateForm = useCallback(() => {
    setEditingCategory(null);
    setIsFormVisible(true);
  }, []);

  const openEditForm = useCallback((category: CategoryWithStats) => {
    if (isProtectedCategoryName(category.nom)) return;
    setEditingCategory(category);
    setIsFormVisible(true);
  }, []);

  const handleDeleteRequest = useCallback((category: CategoryWithStats) => {
    if (isProtectedCategoryName(category.nom)) return;
    if (category.nombreTransactions > 0) {
      setBlockedCategory(category);
    } else {
      setCategoryToDelete(category);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      showToast("success", "Catégorie supprimée avec succès");
    } catch {
      showToast("error", "Une erreur est survenue lors de la suppression.");
    }
    setCategoryToDelete(null);
  }, [categoryToDelete, showToast]);

  const renderItem = useCallback(
    ({ item, index }: { item: CategoryWithStats; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <CategoryCard
          category={toCardData(item)}
          onEdit={() => openEditForm(item)}
          onDelete={() => handleDeleteRequest(item)}
        />
      </Animated.View>
    ),
    [openEditForm, handleDeleteRequest],
  );

  return (
    <Screen>
      <AppHeader
        title="Catégories"
        subtitle={`${categories.length} catégorie${categories.length > 1 ? "s" : ""}`}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter une catégorie"
            hitSlop={8}
            onPress={openCreateForm}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary-50 active:bg-primary-100"
          >
            <Icon name="add" size={22} color="#2563eb" />
          </Pressable>
        }
      />

      <FlatList
        data={visibleCategories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        contentContainerClassName="gap-3 px-5 pb-24"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-3">
            <AppSearchBar value={search} onChangeText={setSearch} placeholder="Rechercher une catégorie…" />
            <View className="flex-row gap-2">
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
                      "rounded-full px-4 py-2",
                      isActive ? "bg-primary-600" : "bg-neutral-100",
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
            icon="pricetags-outline"
            title="Aucune catégorie"
            message={search ? "Aucun résultat pour cette recherche." : "Ajoutez votre première catégorie."}
          />
        }
      />

      <AppFAB onPress={openCreateForm} />

      <CategoryFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        category={editingCategory}
        existingNames={existingNames}
      />

      <ConfirmationDialog
        visible={categoryToDelete !== null}
        title="Supprimer la catégorie"
        message={`Voulez-vous vraiment supprimer "${categoryToDelete?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      <AppModal
        visible={blockedCategory !== null}
        onClose={() => setBlockedCategory(null)}
        title="Suppression impossible"
      >
        <View className="gap-4 pb-2">
          <Text variant="body">
            Impossible de supprimer « {blockedCategory?.nom} » : cette catégorie contient{" "}
            {blockedCategory?.nombreTransactions} transaction
            {(blockedCategory?.nombreTransactions ?? 0) > 1 ? "s" : ""}. Supprimez-les d'abord.
          </Text>
        </View>
      </AppModal>
    </Screen>
  );
}
