import { memo } from "react";
import { View } from "react-native";
import { AppCard, Text, Icon, type IconName } from "@/components/ui";
import { cn } from "@/utils/cn";

export type AppStatisticCardAccent = "primary" | "success" | "danger" | "warning" | "neutral";

export interface AppStatisticCardProps {
  icon: IconName;
  label: string;
  value: string;
  accent?: AppStatisticCardAccent;
}

const ACCENT_BG: Record<AppStatisticCardAccent, string> = {
  primary: "bg-primary-50",
  success: "bg-success/10",
  danger: "bg-danger/10",
  warning: "bg-warning/10",
  neutral: "bg-neutral-100",
};

const ACCENT_COLOR: Record<AppStatisticCardAccent, string> = {
  primary: "#2563eb",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#d97706",
  neutral: "#4b5563",
};

function AppStatisticCardComponent({ icon, label, value, accent = "primary" }: AppStatisticCardProps) {
  return (
    <AppCard className="flex-1 gap-3" accessible accessibilityLabel={`${label} : ${value}`}>
      <View className={cn("h-10 w-10 items-center justify-center rounded-xl", ACCENT_BG[accent])}>
        <Icon name={icon} size={20} color={ACCENT_COLOR[accent]} />
      </View>
      <View className="gap-0.5">
        <Text variant="title" className="text-xl">
          {value}
        </Text>
        <Text variant="caption">{label}</Text>
      </View>
    </AppCard>
  );
}

export const AppStatisticCard = memo(AppStatisticCardComponent);
