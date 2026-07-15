import { memo } from "react";
import { Pressable, View } from "react-native";
import { AppCard, Text, Icon, type IconName } from "@/components/ui";
import { formatFCFA } from "@/utils/formatFCFA";
import { cn } from "@/utils/cn";

export type AppMoneyCardVariant = "primary" | "success" | "danger" | "neutral";

export interface AppMoneyCardProps {
  icon: IconName;
  label: string;
  amount: number;
  variant?: AppMoneyCardVariant;
  onEdit?: () => void;
}

const VARIANT_BG: Record<AppMoneyCardVariant, string> = {
  primary: "bg-primary-600",
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-neutral-800",
};

function AppMoneyCardComponent({ icon, label, amount, variant = "primary", onEdit }: AppMoneyCardProps) {
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
      <View className="flex-row items-end justify-between">
        <Text variant="title" className="text-2xl text-white">
          {formatFCFA(amount)}
        </Text>
        {onEdit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier ${label.toLowerCase()}`}
            hitSlop={8}
            onPress={onEdit}
            className="flex-row items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 active:bg-white/25"
          >
            <Icon name="create-outline" size={14} color="#ffffff" />
            <Text variant="caption" className="font-semibold text-white">
              Modifier
            </Text>
          </Pressable>
        ) : null}
      </View>
    </AppCard>
  );
}

export const AppMoneyCard = memo(AppMoneyCardComponent);
