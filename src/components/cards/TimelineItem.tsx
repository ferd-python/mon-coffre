import { memo } from "react";
import { View } from "react-native";
import { Text, Icon, type IconName } from "@/components/ui";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";

export interface TimelineItemData {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: IconName;
  accent?: "success" | "danger" | "primary";
}

export interface TimelineItemProps {
  item: TimelineItemData;
  isLast?: boolean;
}

const ACCENT_BG: Record<NonNullable<TimelineItemData["accent"]>, string> = {
  success: "bg-success",
  danger: "bg-danger",
  primary: "bg-primary-600",
};

function TimelineItemComponent({ item, isLast = false }: TimelineItemProps) {
  const accent = item.accent ?? "primary";

  return (
    <View className="flex-row gap-4" accessible accessibilityLabel={`${item.title}, ${item.description}, ${formatDate(item.date)}`}>
      <View className="items-center">
        <View
          className={cn(
            "h-9 w-9 items-center justify-center rounded-full",
            ACCENT_BG[accent],
          )}
        >
          <Icon name={item.icon} size={16} color="#ffffff" />
        </View>
        {!isLast ? <View className="w-0.5 flex-1 bg-neutral-200" /> : null}
      </View>
      <View className="flex-1 gap-1 pb-6">
        <Text variant="caption">{formatDate(item.date)}</Text>
        <Text variant="body" className="font-semibold">
          {item.title}
        </Text>
        <Text variant="caption">{item.description}</Text>
      </View>
    </View>
  );
}

export const TimelineItem = memo(TimelineItemComponent);
