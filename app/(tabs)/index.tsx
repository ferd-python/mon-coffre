import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppButton, AppCard, AppHeader, Icon, Screen, Text, type IconName } from "@/components/ui";
import { AppMoneyCard, AppStatisticCard } from "@/components/cards";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import type { CategoryWithStats } from "@/hooks/useCategoriesWithStats";
import { formatFCFA } from "@/utils/formatFCFA";

export default function DashboardScreen() {
  const router = useRouter();
  const { soldeGlobal, totalEglise, nombreCategories, nombreTransactions, categories } =
    useDashboardSummary();

  const renderItem = useCallback(
    ({ item, index }: { item: CategoryWithStats; index: number }) => (
      <Animated.View entering={FadeInDown.delay(220 + Math.min(index, 10) * 40).springify()}>
        <AppCard className="flex-row items-center gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${item.couleur ?? "#6b7280"}1A` }}
          >
            <Icon
              name={(item.icone as IconName | null) ?? "pricetag-outline"}
              size={20}
              color={item.couleur ?? "#6b7280"}
            />
          </View>
          <Text variant="body" className="flex-1 font-semibold">
            {item.nom}
          </Text>
          <Text variant="body" className="font-semibold">
            {formatFCFA(item.solde)}
          </Text>
        </AppCard>
      </Animated.View>
    ),
    [],
  );

  return (
    <Screen>
      <AppHeader title="Tableau de bord" subtitle="Vue d'ensemble de votre coffre" />
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        contentContainerClassName="gap-3 px-5 pb-10"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-4 pb-4">
            <Animated.View entering={FadeInDown.delay(0).springify()}>
              <AppMoneyCard icon="wallet-outline" label="Solde global" amount={soldeGlobal} variant="primary" />
            </Animated.View>

            <View className="flex-row gap-3">
              <Animated.View entering={FadeInDown.delay(60).springify()} className="flex-1">
                <AppStatisticCard
                  icon="pricetags-outline"
                  label="Catégories"
                  value={String(nombreCategories)}
                  accent="primary"
                />
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(100).springify()} className="flex-1">
                <AppStatisticCard
                  icon="swap-horizontal-outline"
                  label="Transactions"
                  value={String(nombreTransactions)}
                  accent="neutral"
                />
              </Animated.View>
            </View>

            <Animated.View entering={FadeInDown.delay(140).springify()}>
              <AppMoneyCard icon="business-outline" label="Total Église" amount={totalEglise} variant="success" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(180).springify()} className="flex-row gap-3">
              <AppButton
                label="Nouvelle opération"
                icon="add-circle-outline"
                className="flex-1"
                onPress={() => router.push("/transactions")}
              />
              <AppButton
                label="Ajouter une catégorie"
                icon="pricetag-outline"
                variant="secondary"
                className="flex-1"
                onPress={() => router.push("/categories")}
              />
            </Animated.View>

            <Text variant="subtitle">Catégories</Text>
          </View>
        }
      />
    </Screen>
  );
}
