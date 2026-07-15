import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

export const PIN_LENGTH = 4;

const PIN_KEY = "mon_coffre_pin";
const PIN_ENABLED_KEY = "mon_coffre_pin_enabled";
const BIOMETRIC_ENABLED_KEY = "mon_coffre_biometric_enabled";
const ONBOARDING_ASKED_KEY = "mon_coffre_security_onboarding_asked";

export async function getStoredPin(): Promise<string | null> {
  return SecureStore.getItemAsync(PIN_KEY);
}

export async function setStoredPin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function clearStoredPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function isPinEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(PIN_ENABLED_KEY);
  return value === "true";
}

export async function setPinEnabledFlag(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(PIN_ENABLED_KEY, enabled ? "true" : "false");
}

export async function isBiometricEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return value === "true";
}

export async function setBiometricEnabledFlag(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? "true" : "false");
}

export async function hasAskedSecurityOnboarding(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(ONBOARDING_ASKED_KEY);
  return value === "true";
}

export async function markSecurityOnboardingAsked(): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_ASKED_KEY, "true");
}

export async function hasBiometricHardware(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  return LocalAuthentication.isEnrolledAsync();
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: "Annuler",
    disableDeviceFallback: true,
  });
  return result.success;
}
