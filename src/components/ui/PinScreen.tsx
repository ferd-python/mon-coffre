import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Screen } from "./Screen";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { PinDots } from "./PinDots";
import { PinKeypad } from "./PinKeypad";
import { PIN_LENGTH } from "@/lib/security";

export interface PinScreenProps {
  title: string;
  subtitle?: string;
  error?: string;
  onSubmit: (pin: string) => void;
  onCancel?: () => void;
  biometricAvailable?: boolean;
  onBiometric?: () => void;
}

export function PinScreen({
  title,
  subtitle,
  error,
  onSubmit,
  onCancel,
  biometricAvailable = false,
  onBiometric,
}: PinScreenProps) {
  const [digits, setDigits] = useState("");

  useEffect(() => {
    if (digits.length === PIN_LENGTH) {
      const pin = digits;
      setDigits("");
      onSubmit(pin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  useEffect(() => {
    if (error) setDigits("");
  }, [error]);

  return (
    <Screen className="items-center justify-center gap-8 px-6">
      {onCancel ? (
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          hitSlop={12}
          className="absolute left-5 top-14"
        >
          <Icon name="close" size={24} color="#6b7280" />
        </Pressable>
      ) : null}

      <View className="items-center gap-2">
        <Text variant="title" className="text-center">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" className="text-center">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <PinDots
        length={PIN_LENGTH}
        filled={digits.length}
        error={Boolean(error)}
        accessibilityLabel={`${digits.length} sur ${PIN_LENGTH} chiffres saisis`}
      />
      {error ? (
        <Text
          variant="caption"
          className="text-danger -mt-4 text-center"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}

      <PinKeypad
        onPress={(digit) => setDigits((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev))}
        onBackspace={() => setDigits((prev) => prev.slice(0, -1))}
      />

      {biometricAvailable && onBiometric ? (
        <Pressable
          onPress={onBiometric}
          accessibilityRole="button"
          accessibilityLabel="Utiliser la biométrie"
          className="mt-2 flex-row items-center gap-2"
        >
          <Icon name="finger-print-outline" size={20} color="#2563eb" />
          <Text variant="body" className="font-semibold text-primary-600">
            Utiliser la biométrie
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}
