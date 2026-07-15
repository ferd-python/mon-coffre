import { memo } from "react";
import { View } from "react-native";
import { AppCard, Text, Icon, type IconName } from "@/components/ui";
import { formatFCFA } from "@/utils/formatFCFA";
import { cn } from "@/utils/cn";

export type AppMoneyCardVariant = "primary" | "success" | "danger" | "neutral";

export interface AppMoneyCardProps {
  icon: IconName;
  label: string;
  amount: number;
  variant?: AppMoneyCardVariant;
}

const VARIANT_BG: Record<AppMoneyCardVariant, string> = {
  primary: "bg-primary-600",
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-neutral-800",
};

function AppMoneyCardComponent({ icon, label, amount, variant = "primary" }: AppMoneyCardProps) {
  return (
    <AppCard
      className={cn("gap-4 border-0", VARIANT_BG[variant])}
      accessible
      accessibilityLabel={`${label} : ${formatFCFA(amount)}`}
    >
      <View className="flex-row items-center justify-between">
        <Text variant="caption" className="text-white/80">
          {label}
        </Text>
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <Icon name={icon} size={16} color="#ffffff" />
        </View>
      </View>
      <Text variant="title" className="text-2xl text-white">
        {formatFCFA(amount)}
      </Text>
    </AppCard>
  );
}

export const AppMoneyCard = memo(AppMoneyCardComponent);
