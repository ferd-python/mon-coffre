import { useEffect, useState, type ReactNode } from "react";
import { AppState, View } from "react-native";
import { AppButton, Icon, Loading, PinScreen, Screen, Text } from "@/components/ui";
import { PinSetupFlow } from "./PinSetupFlow";
import { useSecurity } from "@/hooks/useSecurity";
import { useToast } from "@/lib/toast";

export interface SecurityGateProps {
  children: ReactNode;
}

const GENERIC_SECURITY_ERROR = "Une erreur est survenue. Veuillez réessayer.";

export function SecurityGate({ children }: SecurityGateProps) {
  const security = useSecurity();
  const { showToast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [lockError, setLockError] = useState<string | undefined>();

  const biometricReady = security.biometricEnabled && security.hasBiometricHardware;

  const handleBiometric = async () => {
    try {
      const success = await security.authenticateWithBiometrics("Déverrouillez Mon Coffre");
      if (success) {
        setIsUnlocked(true);
        setLockError(undefined);
      }
    } catch {
      // Biometric prompt failed or was dismissed; the user can still enter their PIN.
    }
  };

  useEffect(() => {
    if (!security.isLoading && security.pinEnabled && biometricReady && !isUnlocked) {
      handleBiometric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [security.isLoading, isUnlocked]);

  useEffect(() => {
    if (!security.pinEnabled) return;
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") {
        setIsUnlocked(false);
      }
    });
    return () => subscription.remove();
  }, [security.pinEnabled]);

  const handleSkipOnboarding = async () => {
    try {
      await security.completeOnboarding();
    } catch {
      showToast("error", GENERIC_SECURITY_ERROR);
    }
  };

  if (security.isLoading) {
    return (
      <Screen>
        <Loading label="Chargement…" />
      </Screen>
    );
  }

  if (!security.onboardingAsked) {
    if (showSetup) {
      return (
        <PinSetupFlow
          onCancel={() => setShowSetup(false)}
          onComplete={async (pin) => {
            try {
              await security.enablePin(pin);
              await security.completeOnboarding();
              setIsUnlocked(true);
              showToast("success", "Code PIN activé avec succès");
            } catch {
              showToast("error", GENERIC_SECURITY_ERROR);
            }
          }}
        />
      );
    }

    return (
      <Screen className="items-center justify-center gap-6 px-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Icon name="shield-checkmark-outline" size={30} color="#2563eb" />
        </View>
        <Text variant="title" className="text-center">
          Protéger votre coffre ?
        </Text>
        <Text variant="caption" className="text-center">
          Activez un code PIN à 4 chiffres pour empêcher tout accès non autorisé à vos données.
        </Text>
        <View className="w-full gap-3">
          <AppButton label="Activer le code PIN" fullWidth onPress={() => setShowSetup(true)} />
          <AppButton label="Plus tard" variant="secondary" fullWidth onPress={handleSkipOnboarding} />
        </View>
      </Screen>
    );
  }

  if (security.pinEnabled && !isUnlocked) {
    return (
      <PinScreen
        title="Coffre verrouillé"
        subtitle="Saisissez votre code PIN"
        error={lockError}
        biometricAvailable={biometricReady}
        onBiometric={handleBiometric}
        onSubmit={async (pin) => {
          try {
            const isValid = await security.verifyPin(pin);
            if (isValid) {
              setIsUnlocked(true);
              setLockError(undefined);
            } else {
              setLockError("Code PIN incorrect");
            }
          } catch {
            setLockError(GENERIC_SECURITY_ERROR);
          }
        }}
      />
    );
  }

  return <>{children}</>;
}
