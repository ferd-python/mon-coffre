import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  AppButton,
  AppEmptyState,
  AppHeader,
  AppSearchBar,
  ConfirmationDialog,
  Screen,
  Text,
} from "@/components/ui";
import { ChurchFormModal } from "@/components/forms";
import { AppMoneyCard, AppStatisticCard, ChurchContributionCard } from "@/components/cards";
import { useChurchContributionsQuery } from "@/hooks/useChurchContributionsQuery";
import { churchService } from "@/services";
import { useToast } from "@/lib/toast";
import { cn } from "@/utils/cn";
import { formatFCFA } from "@/utils/formatFCFA";
import { formatDate } from "@/utils/formatDate";
import {
  computeChurchStatistics,
  filterContributionsByPeriod,
  type ChurchPeriodFilter,
} from "@/utils/calculations";
import type { ChurchContribution } from "@/types";

const PERIOD_OPTIONS: { key: ChurchPeriodFilter; label: string }[] = [
  { key: "SEMAINE", label: "Cette semaine" },
  { key: "MOIS", label: "Ce mois" },
  { key: "ANNEE", label: "Cette année" },
  { key: "TOUT", label: "Toutes" },
];

export default function ChurchScreen() {
  const { data: contributions } = useChurchContributionsQuery();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<ChurchPeriodFilter>("TOUT");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingContribution, setEditingContribution] = useState<ChurchContribution | null>(null);
  const [contributionToDelete, setContributionToDelete] = useState<ChurchContribution | null>(null);

  const stats = useMemo(() => computeChurchStatistics(contributions), [contributions]);

  const visibleContributions = useMemo(() => {
    const periodFiltered = filterContributionsByPeriod(contributions, period);
    const term = search.trim().toLowerCase();
    if (!term) return periodFiltered;
    return periodFiltered.filter(
      (contribution) =>
        contribution.date.toLowerCase().includes(term) ||
        (contribution.commentaire ?? "").toLowerCase().includes(term),
    );
  }, [contributions, period, search]);

  const openCreateForm = useCallback(() => {
    setEditingContribution(null);
    setIsFormVisible(true);
  }, []);

  const openEditForm = useCallback((contribution: ChurchContribution) => {
    setEditingContribution(contribution);
    setIsFormVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!contributionToDelete) return;
    try {
      await churchService.delete(contributionToDelete.id);
      showToast("success", "Cotisation supprimée avec succès");
    } catch {
      showToast("error", "Une erreur est survenue lors de la suppression.");
    }
    setContributionToDelete(null);
  }, [contributionToDelete, showToast]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChurchContribution; index: number }) => (
      <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).springify()}>
        <ChurchContributionCard
          contribution={item}
          onEdit={() => openEditForm(item)}
          onDelete={() => setContributionToDelete(item)}
        />
      </Animated.View>
    ),
    [openEditForm],
  );

  return (
    <Screen>
      <AppHeader title="Église" subtitle="Suivi des cotisations" />

      <FlatList
        data={visibleContributions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        contentContainerClassName="gap-3 px-5 pb-24"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <AppMoneyCard icon="leaf-outline" label="Total Sème" amount={stats.totalSeme} variant="primary" />
            <AppMoneyCard
              icon="flower-outline"
              label="Total Funérailles"
              amount={stats.totalFunerailles}
              variant="neutral"
            />
            <AppMoneyCard
              icon="business-outline"
              label="Total Général"
              amount={stats.totalGeneral}
              variant="success"
            />

            <View className="flex-row gap-3">
              <AppStatisticCard
                icon="calendar-number-outline"
                label="Dimanches enregistrés"
                value={String(stats.nombreDimanches)}
                accent="primary"
              />
              <AppStatisticCard
                icon="time-outline"
                label="Dernière cotisation"
                value={stats.derniereCotisation ? formatDate(stats.derniereCotisation.date) : "—"}
                accent="neutral"
              />
            </View>

            <AppButton
              label="Ajouter une cotisation"
              icon="add-circle-outline"
              fullWidth
              onPress={openCreateForm}
            />

            <Text variant="subtitle">Statistiques</Text>
            <View className="flex-row gap-3">
              <AppStatisticCard
                icon="stats-chart-outline"
                label="Total annuel"
                value={formatFCFA(stats.totalAnnuel)}
                accent="primary"
              />
              <AppStatisticCard
                icon="calendar-outline"
                label="Total mensuel"
                value={formatFCFA(stats.totalMensuel)}
                accent="neutral"
              />
            </View>
            <View className="flex-row gap-3">
              <AppStatisticCard
                icon="analytics-outline"
                label="Moyenne / dimanche"
                value={stats.moyenneParDimanche === null ? "—" : formatFCFA(stats.moyenneParDimanche)}
                accent="warning"
              />
              <AppStatisticCard
                icon="trophy-outline"
                label="Plus grosse cotisation"
                value={
                  stats.plusGrosseCotisation === null
                    ? "—"
                    : formatFCFA(stats.plusGrosseCotisation.seme + stats.plusGrosseCotisation.funerailles)
                }
                accent="success"
              />
            </View>

            <AppSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher par date ou commentaire…"
            />
            <View className="flex-row flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => {
                const isActive = period === option.key;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrer : ${option.label}`}
                    accessibilityState={{ selected: isActive }}
                    onPress={() => setPeriod(option.key)}
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

            <Text variant="subtitle">Cotisations</Text>
          </View>
        }
        ListEmptyComponent={
          <AppEmptyState
            icon="business-outline"
            title="Aucune cotisation"
            message={
              search || period !== "TOUT"
                ? "Aucun résultat pour ces critères."
                : "Les cotisations que vous ajouterez apparaîtront ici."
            }
          />
        }
      />

      <ChurchFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        contribution={editingContribution}
      />

      <ConfirmationDialog
        visible={contributionToDelete !== null}
        title="Supprimer la cotisation"
        message="Voulez-vous vraiment supprimer cette cotisation ? Cette action est irréversible."
        confirmLabel="Supprimer"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setContributionToDelete(null)}
      />
    </Screen>
  );
}
