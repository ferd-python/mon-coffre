import "@/theme/global.css";
import "@/lib/animated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary, Loading, Screen, Text } from "@/components/ui";
import { SecurityGate } from "@/components/forms";
import { useDatabaseMigrations, useSeedDefaultCategories } from "@/hooks";
import { ToastProvider } from "@/lib/toast";

export default function RootLayout() {
  const { success, error } = useDatabaseMigrations();
  const isSeeded = useSeedDefaultCategories(success);

  if (error) {
    return (
      <Screen className="items-center justify-center px-6">
        <Text variant="subtitle" className="text-danger text-center">
          Erreur d'initialisation de la base de données
        </Text>
        <Text variant="caption" className="mt-2 text-center">
          {error.message}
        </Text>
      </Screen>
    );
  }

  if (!success || !isSeeded) {
    return (
      <Screen>
        <Loading label="Chargement…" />
      </Screen>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar style="auto" />
          <SecurityGate>
            <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
          </SecurityGate>
        </ToastProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
