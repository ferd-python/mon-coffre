import "@/theme/global.css";
import "@/lib/animated";

import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary, Loading, Screen, Text } from "@/components/ui";
import { SecurityGate } from "@/components/forms";
import {
  useDatabaseMigrations,
  useSeedDefaultCategories,
  useSeedSettings,
  useSyncErrorWatcher,
} from "@/hooks";
import { ToastProvider } from "@/lib/toast";
import { ready as databaseReady } from "@/database/client";

function SyncErrorWatcher() {
  useSyncErrorWatcher();
  return null;
}

function RootLayoutContent() {
  const { success, error } = useDatabaseMigrations();
  const isCategoriesSeeded = useSeedDefaultCategories(success);
  const isSettingsSeeded = useSeedSettings(success);
  const isSeeded = isCategoriesSeeded && isSettingsSeeded;

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
          <SyncErrorWatcher />
          <SecurityGate>
            <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
          </SecurityGate>
        </ToastProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      databaseReady.then(() => setIsDatabaseReady(true));
    }
  }, []);

  if (!isDatabaseReady) {
    return (
      <Screen>
        <Loading label="Chargement…" />
      </Screen>
    );
  }

  return <RootLayoutContent />;
}
