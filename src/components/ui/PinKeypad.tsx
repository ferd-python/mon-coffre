import { Pressable, View } from "react-native";
import { Text } from "./Text";
import { Icon } from "./Icon";

export interface PinKeypadProps {
  onPress: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"];

export function PinKeypad({ onPress, onBackspace, disabled = false }: PinKeypadProps) {
  return (
    <View className="flex-row flex-wrap justify-center gap-4" style={{ width: 3 * 64 + 2 * 16 }}>
      {KEYS.map((key, index) => {
        if (key === "") {
          return <View key={index} className="h-16 w-16" />;
        }
        if (key === "backspace") {
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel="Effacer le dernier chiffre"
              disabled={disabled}
              onPress={onBackspace}
              className="h-16 w-16 items-center justify-center rounded-full active:bg-neutral-100"
            >
              <Icon name="backspace-outline" size={24} color="#374151" />
            </Pressable>
          );
        }
        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`Chiffre ${key}`}
            disabled={disabled}
            onPress={() => onPress(key)}
            className="h-16 w-16 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <Text variant="title" className="text-2xl">
              {key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
