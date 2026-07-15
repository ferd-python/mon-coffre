import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppCard, AppHeader, Icon, Screen, Text } from "@/components/ui";
import { AppStatisticCard } from "@/components/cards";
import { useStatistics } from "@/hooks/useStatistics";
import { formatFCFA } from "@/utils/formatFCFA";

const CHART_PLACEHOLDERS = [
  { icon: "bar-chart-outline", title: "Entrées / Sorties par mois" },
  { icon: "pie-chart-outline", title: "Répartition par catégorie" },
] as const;

export default function StatisticsScreen() {
  const { moyenneMensuelle, categorieActive, ceMoisCi, tauxEpargne } = useStatistics();

  const stats = [
    {
      icon: "trending-up-outline" as const,
      label: "Moyenne mensuelle",
      value: moyenneMensuelle === null ? "—" : formatFCFA(moyenneMensuelle),
    },
    {
      icon: "star-outline" as const,
      label: "Catégorie la + active",
      value: categorieActive?.nom ?? "—",
    },
    {
      icon: "calendar-outline" as const,
      label: "Ce mois-ci",
      value: ceMoisCi === null ? "—" : formatFCFA(ceMoisCi),
    },
    {
      icon: "podium-outline" as const,
      label: "Taux d'épargne",
      value: tauxEpargne === null ? "—" : `${tauxEpargne.toFixed(0)} %`,
    },
  ];

  return (
    <Screen>
      <AppHeader title="Statistiques" subtitle="Analyse de vos finances" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-3">
          {stats.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(index * 50).springify()}
              className="min-w-[45%] flex-1"
            >
              <AppStatisticCard icon={stat.icon} label={stat.label} value={stat.value} accent="neutral" />
            </Animated.View>
          ))}
        </View>

        <View className="gap-3">
          {CHART_PLACEHOLDERS.map((chart, index) => (
            <Animated.View
              key={chart.title}
              entering={FadeInDown.delay(200 + index * 80).springify()}
            >
              <AppCard className="items-center gap-3 border-dashed py-10">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
                  <Icon name={chart.icon} size={26} color="#9ca3af" />
                </View>
                <Text variant="body" className="font-semibold">
                  {chart.title}
                </Text>
                <Text variant="caption">Graphique disponible dans une prochaine étape</Text>
              </AppCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
