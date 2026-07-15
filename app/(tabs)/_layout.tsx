import { Tabs } from "expo-router";
import { Icon, type IconName } from "@/components/ui";
import { colors } from "@/theme";

const TAB_ICONS: Record<string, IconName> = {
  index: "home-outline",
  categories: "pricetags-outline",
  transactions: "swap-horizontal-outline",
  church: "business-outline",
  history: "time-outline",
  statistics: "bar-chart-outline",
  settings: "settings-outline",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#111827",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 12,
        },
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[route.name] ?? "ellipse-outline"} color={color} size={size} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Tableau de bord" }} />
      <Tabs.Screen name="categories" options={{ title: "Catégories" }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <Tabs.Screen name="church" options={{ title: "Église" }} />
      <Tabs.Screen name="history" options={{ title: "Historique" }} />
      <Tabs.Screen name="statistics" options={{ title: "Statistiques" }} />
      <Tabs.Screen name="settings" options={{ title: "Paramètres" }} />
    </Tabs>
  );
}
