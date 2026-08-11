import "@/theme/global.css";
import "@/lib/animated";

import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppButton, ErrorBoundary, Loading, Screen, Text } from "@/components/ui";
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
    const cause = (error as { cause?: unknown }).cause;
    const causeMessage = cause instanceof Error ? cause.message : undefined;
    return (
      <Screen className="items-center justify-center px-6">
        <Text variant="subtitle" className="text-danger text-center">
          Erreur d'initialisation de la base de données
        </Text>
        <Text variant="caption" className="mt-2 text-center">
          {causeMessage ?? error.message}
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
  const [databaseStartupError, setDatabaseStartupError] = useState<Error | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      databaseReady.then(
        () => setIsDatabaseReady(true),
        (err) => setDatabaseStartupError(err instanceof Error ? err : new Error(String(err))),
      );
    }
  }, []);

  if (databaseStartupError) {
    return (
      <Screen className="items-center justify-center px-6">
        <Text variant="subtitle" className="text-danger text-center">
          Erreur d'initialisation de la base de données
        </Text>
        <Text variant="caption" className="mt-2 text-center">
          {databaseStartupError.message}
        </Text>
        <AppButton
          label="Réessayer"
          className="mt-4"
          onPress={() => window.location.reload()}
        />
      </Screen>
    );
  }

  if (!isDatabaseReady) {
    return (
      <Screen>
        <Loading label="Chargement…" />
      </Screen>
    );
  }

  return <RootLayoutContent />;
}
