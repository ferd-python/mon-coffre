import { View } from "react-native";
import { Text } from "./Text";
import { Icon, type IconName } from "./Icon";
import { AppButton } from "./AppButton";

export interface AppEmptyStateProps {
  icon: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AppEmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-50">
        <Icon name={icon} size={30} color="#2563eb" />
      </View>
      <Text variant="subtitle" className="text-center">
        {title}
      </Text>
      {message ? (
        <Text variant="caption" className="text-center">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} size="sm" className="mt-2" />
      ) : null}
    </View>
  );
}
