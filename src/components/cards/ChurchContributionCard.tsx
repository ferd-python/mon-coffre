import { memo } from "react";
import { Pressable, View } from "react-native";
import { AppCard, Text, Icon } from "@/components/ui";
import { formatFCFA } from "@/utils/formatFCFA";
import { formatDate } from "@/utils/formatDate";

export interface ChurchContributionCardData {
  id: number;
  date: string;
  seme: number;
  funerailles: number;
  commentaire?: string | null;
}

export interface ChurchContributionCardProps {
  contribution: ChurchContributionCardData;
  onEdit?: (contribution: ChurchContributionCardData) => void;
  onDelete?: (contribution: ChurchContributionCardData) => void;
}

function ChurchContributionCardComponent({
  contribution,
  onEdit,
  onDelete,
}: ChurchContributionCardProps) {
  const total = contribution.seme + contribution.funerailles;
  const formattedDate = formatDate(contribution.date);

  return (
    <AppCard className="gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon name="calendar-outline" size={16} color="#6b7280" />
          <Text variant="caption">{formattedDate}</Text>
        </View>
        <Text variant="body" className="font-bold text-primary-700">
          Total {formatFCFA(total)}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-0.5 rounded-xl bg-primary-50 p-3">
          <Text variant="caption">Sème</Text>
          <Text variant="subtitle" className="text-base">
            {formatFCFA(contribution.seme)}
          </Text>
        </View>
        <View className="flex-1 gap-0.5 rounded-xl bg-neutral-100 p-3">
          <Text variant="caption">Funérailles</Text>
          <Text variant="subtitle" className="text-base">
            {formatFCFA(contribution.funerailles)}
          </Text>
        </View>
      </View>

      {contribution.commentaire ? (
        <Text variant="caption" numberOfLines={2}>
          {contribution.commentaire}
        </Text>
      ) : null}

      {onEdit || onDelete ? (
        <View className="flex-row gap-2 border-t border-neutral-100 pt-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier la cotisation du ${formattedDate}`}
            hitSlop={4}
            onPress={() => onEdit?.(contribution)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-neutral-100 py-2 active:bg-neutral-200"
          >
            <Icon name="create-outline" size={14} color="#374151" />
            <Text variant="caption" className="font-semibold text-neutral-700">
              Modifier
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Supprimer la cotisation du ${formattedDate}`}
            hitSlop={4}
            onPress={() => onDelete?.(contribution)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-danger/10 py-2 active:bg-danger/20"
          >
            <Icon name="trash-outline" size={14} color="#dc2626" />
            <Text variant="caption" className="font-semibold text-danger">
              Supprimer
            </Text>
          </Pressable>
        </View>
      ) : null}
    </AppCard>
  );
}

export const ChurchContributionCard = memo(ChurchContributionCardComponent);
