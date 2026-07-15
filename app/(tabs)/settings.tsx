import { useState } from "react";
import { Modal, Pressable, ScrollView, Switch, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  AppButton,
  AppCard,
  AppHeader,
  AppModal,
  ConfirmationDialog,
  Icon,
  PinScreen,
  Screen,
  Text,
  type IconName,
} from "@/components/ui";
import { PinSetupFlow } from "@/components/forms";
import { APP_NAME, APP_VERSION } from "@/constants/app";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";
import { backupService, BackupError, type BackupSummary } from "@/services";
import type { BackupData } from "@/schemas/backup.schema";
import { useSecurity } from "@/hooks/useSecurity";
import { useToast } from "@/lib/toast";
import { colors } from "@/theme";

type SecurityFlow = null | "enable" | "disable-verify" | "change-verify" | "change-setup";

interface SettingsRowProps {
  icon: IconName;
  label: string;
  description: string;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
  danger?: boolean;
}

function SettingsRow({ icon, label, description, onPress, disabled, isLast, danger }: SettingsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={description}
      onPress={onPress}
      disabled={disabled || !onPress}
      className={cn(
        "flex-row items-center gap-3 py-3.5 active:opacity-60",
        !isLast && "border-b border-neutral-100",
        disabled && "opacity-50",
      )}
    >
      <View className={cn("h-10 w-10 items-center justify-center rounded-xl", danger ? "bg-danger/10" : "bg-neutral-100")}>
        <Icon name={icon} size={18} color={danger ? "#dc2626" : "#374151"} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="body" className={cn("font-semibold", danger && "text-danger")}>
          {label}
        </Text>
        <Text variant="caption">{description}</Text>
      </View>
      {onPress ? <Icon name="chevron-forward" size={18} color="#9ca3af" /> : null}
    </Pressable>
  );
}

interface SettingsToggleRowProps {
  icon: IconName;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}

function SettingsToggleRow({ icon, label, description, value, onValueChange, isLast }: SettingsToggleRowProps) {
  return (
    <View className={cn("flex-row items-center gap-3 py-3.5", !isLast && "border-b border-neutral-100")}>
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
        <Icon name={icon} size={18} color="#374151" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="body" className="font-semibold">
          {label}
        </Text>
        <Text variant="caption">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e5e7eb", true: colors.primary[600] }}
        thumbColor="#ffffff"
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={description}
      />
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="caption">{label}</Text>
      <Text variant="body" className="font-semibold">
        {value}
      </Text>
    </View>
  );
}

export default function SettingsScreen() {
  const security = useSecurity();
  const { showToast } = useToast();

  const [securityFlow, setSecurityFlow] = useState<SecurityFlow>(null);
  const [securityError, setSecurityError] = useState<string | undefined>();
  const [pendingRestore, setPendingRestore] = useState<{ data: BackupData; summary: BackupSummary } | null>(null);
  const [showDeleteStep1, setShowDeleteStep1] = useState(false);
  const [showDeleteStep2, setShowDeleteStep2] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const closeSecurityFlow = () => {
    setSecurityFlow(null);
    setSecurityError(undefined);
  };

  const handleCreateBackup = async () => {
    setIsBusy(true);
    try {
      const { data } = await backupService.createBackupFile();
      showToast(
        "success",
        `Sauvegarde créée : ${data.categories.length} catégories, ${data.transactions.length} transactions, ${data.cotisationsEglise.length} cotisations`,
      );
    } catch {
      showToast("error", "La création de la sauvegarde a échoué.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleShareBackup = async () => {
    setIsBusy(true);
    try {
      await backupService.shareBackup();
    } catch (error) {
      showToast("error", error instanceof BackupError ? error.message : "Le partage a échoué.");
    } finally {
      setIsBusy(false);
    }
  };

  const handlePickRestoreFile = async () => {
    setIsBusy(true);
    try {
      const result = await backupService.pickBackupFile();
      if (result) setPendingRestore(result);
    } catch (error) {
      showToast("error", error instanceof BackupError ? error.message : "Impossible de lire ce fichier.");
    } finally {
      setIsBusy(false);
    }
  };

  const confirmRestore = async () => {
    if (!pendingRestore) return;
    setIsBusy(true);
    try {
      await backupService.restoreBackup(pendingRestore.data);
      showToast("success", "Données restaurées avec succès");
      setPendingRestore(null);
    } catch (error) {
      showToast("error", error instanceof BackupError ? error.message : "La restauration a échoué.");
    } finally {
      setIsBusy(false);
    }
  };

  const confirmResetAllData = async () => {
    setIsBusy(true);
    try {
      await backupService.resetAllData();
      showToast("success", "Toutes les données ont été supprimées et réinitialisées");
    } catch {
      showToast("error", "La réinitialisation a échoué.");
    } finally {
      setIsBusy(false);
      setShowDeleteStep2(false);
    }
  };

  return (
    <Screen>
      <AppHeader title="Paramètres" subtitle="Gérez votre application" />
      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="gap-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <AppCard className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
              <Icon name="lock-closed-outline" size={26} color="#ffffff" />
            </View>
            <View className="gap-0.5">
              <Text variant="subtitle">{APP_NAME}</Text>
              <Text variant="caption">Version {APP_VERSION}</Text>
            </View>
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).springify()} className="gap-2">
          <Text variant="caption" className="px-1 font-semibold uppercase text-neutral-400">
            Sauvegarde
          </Text>
          <AppCard>
            <SettingsRow
              icon="save-outline"
              label="Créer une sauvegarde"
              description="Exporter toutes vos données en JSON"
              onPress={handleCreateBackup}
              disabled={isBusy}
            />
            <SettingsRow
              icon="folder-open-outline"
              label="Restaurer une sauvegarde"
              description="Importer un fichier de sauvegarde"
              onPress={handlePickRestoreFile}
              disabled={isBusy}
            />
            <SettingsRow
              icon="share-social-outline"
              label="Partager une sauvegarde"
              description="Envoyer le fichier de sauvegarde"
              onPress={handleShareBackup}
              disabled={isBusy}
            />
            <SettingsRow
              icon="trash-outline"
              label="Supprimer toutes les données"
              description="Réinitialiser complètement l'application"
              onPress={() => setShowDeleteStep1(true)}
              disabled={isBusy}
              isLast
              danger
            />
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).springify()} className="gap-2">
          <Text variant="caption" className="px-1 font-semibold uppercase text-neutral-400">
            Sécurité
          </Text>
          <AppCard>
            <SettingsToggleRow
              icon="keypad-outline"
              label="Protection par code PIN"
              description={security.pinEnabled ? "Activée" : "Désactivée"}
              value={security.pinEnabled}
              onValueChange={(value) => setSecurityFlow(value ? "enable" : "disable-verify")}
              isLast={!security.pinEnabled}
            />
            {security.pinEnabled ? (
              <SettingsRow
                icon="key-outline"
                label="Modifier le code PIN"
                description="Changer votre code actuel"
                onPress={() => setSecurityFlow("change-verify")}
                isLast={!security.hasBiometricHardware}
              />
            ) : null}
            {security.pinEnabled && security.hasBiometricHardware ? (
              <SettingsToggleRow
                icon="finger-print-outline"
                label="Biométrie"
                description="Empreinte digitale ou reconnaissance faciale"
                value={security.biometricEnabled}
                onValueChange={async (value) => {
                  try {
                    await security.toggleBiometric(value);
                  } catch {
                    showToast("error", "Une erreur est survenue. Veuillez réessayer.");
                  }
                }}
                isLast
              />
            ) : null}
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} className="gap-2">
          <Text variant="caption" className="px-1 font-semibold uppercase text-neutral-400">
            Informations
          </Text>
          <AppCard>
            <SettingsRow
              icon="information-circle-outline"
              label="À propos"
              description="En savoir plus sur l'application"
              isLast
            />
          </AppCard>
        </Animated.View>
      </ScrollView>

      <AppModal
        visible={pendingRestore !== null}
        onClose={() => setPendingRestore(null)}
        title="Confirmer la restauration"
      >
        <View className="gap-4 pb-2">
          <Text variant="body">
            Cette action va remplacer toutes vos données actuelles par celles de cette sauvegarde :
          </Text>
          <View className="gap-2 rounded-xl bg-neutral-50 p-4">
            <SummaryRow label="Catégories" value={String(pendingRestore?.summary.nombreCategories ?? 0)} />
            <SummaryRow label="Transactions" value={String(pendingRestore?.summary.nombreTransactions ?? 0)} />
            <SummaryRow label="Cotisations" value={String(pendingRestore?.summary.nombreCotisations ?? 0)} />
            <SummaryRow
              label="Date de la sauvegarde"
              value={pendingRestore ? formatDate(pendingRestore.summary.dateExport) : "—"}
            />
          </View>
          <Text variant="caption" className="text-danger">
            Cette action est irréversible.
          </Text>
          <View className="flex-row gap-3">
            <AppButton
              label="Annuler"
              variant="secondary"
              className="flex-1"
              onPress={() => setPendingRestore(null)}
            />
            <AppButton
              label="Restaurer"
              variant="danger"
              className="flex-1"
              onPress={confirmRestore}
              loading={isBusy}
            />
          </View>
        </View>
      </AppModal>

      <ConfirmationDialog
        visible={showDeleteStep1}
        title="Supprimer toutes les données ?"
        message="Cette action supprimera définitivement toutes vos catégories, transactions et cotisations."
        confirmLabel="Continuer"
        destructive
        onConfirm={() => {
          setShowDeleteStep1(false);
          setShowDeleteStep2(true);
        }}
        onCancel={() => setShowDeleteStep1(false)}
      />
      <ConfirmationDialog
        visible={showDeleteStep2}
        title="Confirmation finale"
        message="Êtes-vous absolument certain ? Cette action est irréversible. Les catégories par défaut seront recréées."
        confirmLabel="Tout supprimer"
        destructive
        onConfirm={confirmResetAllData}
        onCancel={() => setShowDeleteStep2(false)}
      />

      <Modal visible={securityFlow !== null} animationType="slide" presentationStyle="fullScreen">
        {securityFlow === "enable" ? (
          <PinSetupFlow
            onCancel={closeSecurityFlow}
            onComplete={async (pin) => {
              try {
                await security.enablePin(pin);
                closeSecurityFlow();
                showToast("success", "Code PIN activé avec succès");
              } catch {
                showToast("error", "Une erreur est survenue. Veuillez réessayer.");
              }
            }}
          />
        ) : null}
        {securityFlow === "disable-verify" ? (
          <PinScreen
            title="Confirmer la désactivation"
            subtitle="Saisissez votre code PIN actuel"
            error={securityError}
            onCancel={closeSecurityFlow}
            onSubmit={async (pin) => {
              try {
                const isValid = await security.verifyPin(pin);
                if (isValid) {
                  await security.disablePin();
                  closeSecurityFlow();
                  showToast("success", "Code PIN désactivé");
                } else {
                  setSecurityError("Code PIN incorrect");
                }
              } catch {
                setSecurityError("Une erreur est survenue. Veuillez réessayer.");
              }
            }}
          />
        ) : null}
        {securityFlow === "change-verify" ? (
          <PinScreen
            title="Code actuel"
            subtitle="Saisissez votre code PIN actuel"
            error={securityError}
            onCancel={closeSecurityFlow}
            onSubmit={async (pin) => {
              try {
                const isValid = await security.verifyPin(pin);
                if (isValid) {
                  setSecurityError(undefined);
                  setSecurityFlow("change-setup");
                } else {
                  setSecurityError("Code PIN incorrect");
                }
              } catch {
                setSecurityError("Une erreur est survenue. Veuillez réessayer.");
              }
            }}
          />
        ) : null}
        {securityFlow === "change-setup" ? (
          <PinSetupFlow
            onCancel={closeSecurityFlow}
            onComplete={async (pin) => {
              try {
                await security.changePin(pin);
                closeSecurityFlow();
                showToast("success", "Code PIN modifié avec succès");
              } catch {
                showToast("error", "Une erreur est survenue. Veuillez réessayer.");
              }
            }}
          />
        ) : null}
      </Modal>
    </Screen>
  );
}
