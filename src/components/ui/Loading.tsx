import { ActivityIndicator, View } from "react-native";
import { Text } from "./Text";
import { colors } from "@/theme";

export interface LoadingProps {
  label?: string;
}

export function Loading({ label }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color={colors.primary[600]} />
      {label ? <Text variant="caption">{label}</Text> : null}
    </View>
  );
}
