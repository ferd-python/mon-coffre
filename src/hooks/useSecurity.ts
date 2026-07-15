import { useCallback, useEffect, useState } from "react";
import * as security from "@/lib/security";

export function useSecurity() {
  const [isLoading, setIsLoading] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);
  const [onboardingAsked, setOnboardingAsked] = useState(false);

  const refresh = useCallback(async () => {
    const [enabled, biometric, hardware, asked] = await Promise.all([
      security.isPinEnabled(),
      security.isBiometricEnabled(),
      security.hasBiometricHardware(),
      security.hasAskedSecurityOnboarding(),
    ]);
    setPinEnabled(enabled);
    setBiometricEnabledState(biometric);
    setHasBiometricHardware(hardware);
    setOnboardingAsked(asked);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const completeOnboarding = useCallback(async () => {
    await security.markSecurityOnboardingAsked();
    await refresh();
  }, [refresh]);

  const enablePin = useCallback(
    async (pin: string) => {
      await security.setStoredPin(pin);
      await security.setPinEnabledFlag(true);
      await refresh();
    },
    [refresh],
  );

  const disablePin = useCallback(async () => {
    await security.clearStoredPin();
    await security.setPinEnabledFlag(false);
    await security.setBiometricEnabledFlag(false);
    await refresh();
  }, [refresh]);

  const changePin = useCallback(
    async (newPin: string) => {
      await security.setStoredPin(newPin);
      await refresh();
    },
    [refresh],
  );

  const verifyPin = useCallback(async (pin: string) => {
    const stored = await security.getStoredPin();
    return stored !== null && stored === pin;
  }, []);

  const toggleBiometric = useCallback(
    async (enabled: boolean) => {
      await security.setBiometricEnabledFlag(enabled);
      await refresh();
    },
    [refresh],
  );

  const authenticateWithBiometrics = useCallback(async (message: string) => {
    return security.authenticateWithBiometrics(message);
  }, []);

  return {
    isLoading,
    pinEnabled,
    biometricEnabled,
    hasBiometricHardware,
    onboardingAsked,
    refresh,
    completeOnboarding,
    enablePin,
    disablePin,
    changePin,
    verifyPin,
    toggleBiometric,
    authenticateWithBiometrics,
  };
}
