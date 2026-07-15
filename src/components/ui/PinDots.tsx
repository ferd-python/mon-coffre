import { View } from "react-native";
import { cn } from "@/utils/cn";

export interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
  accessibilityLabel?: string;
}

export function PinDots({ length, filled, error = false, accessibilityLabel }: PinDotsProps) {
  return (
    <View className="flex-row gap-4" accessible accessibilityLabel={accessibilityLabel}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          className={cn(
            "h-4 w-4 rounded-full border-2",
            error
              ? "border-danger bg-danger"
              : index < filled
                ? "border-primary-600 bg-primary-600"
                : "border-neutral-300 bg-transparent",
          )}
        />
      ))}
    </View>
  );
}
