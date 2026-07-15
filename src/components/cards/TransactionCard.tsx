import { memo } from "react";
import { Pressable, View } from "react-native";
import { AppCard, Text, Icon } from "@/components/ui";
import { formatFCFA } from "@/utils/formatFCFA";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import type { TransactionType } from "@/types";

export interface TransactionCardData {
  id: number;
  type: TransactionType;
  montant: number;
  description: string;
  categorieNom: string;
  date: string;
}

export interface TransactionCardProps {
  transaction: TransactionCardData;
  onEdit?: (transaction: TransactionCardData) => void;
  onDelete?: (transaction: TransactionCardData) => void;
}

function TransactionCardComponent({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const isIncome = transaction.type === "ENTREE";

  return (
    <AppCard className="gap-3">
      <View className="flex-row items-center gap-3">
        <View
          className={cn(
            "h-11 w-11 items-center justify-center rounded-full",
            isIncome ? "bg-success/10" : "bg-danger/10",
          )}
        >
          <Icon
            name={isIncome ? "arrow-down-outline" : "arrow-up-outline"}
            size={20}
            color={isIncome ? "#16a34a" : "#dc2626"}
          />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="body" className="font-semibold" numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text variant="caption">
            {transaction.categorieNom} • {formatDate(transaction.date)}
          </Text>
        </View>
        <Text
          variant="body"
          className={cn("font-bold", isIncome ? "text-success" : "text-danger")}
          accessibilityLabel={`${isIncome ? "Entrée" : "Sortie"} de ${formatFCFA(transaction.montant)}`}
        >
          {isIncome ? "+" : "-"}
          {formatFCFA(transaction.montant)}
        </Text>
      </View>

      {onEdit || onDelete ? (
        <View className="flex-row gap-2 border-t border-neutral-100 pt-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier la transaction ${transaction.description}`}
            hitSlop={4}
            onPress={() => onEdit?.(transaction)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-neutral-100 py-2 active:bg-neutral-200"
          >
            <Icon name="create-outline" size={14} color="#374151" />
            <Text variant="caption" className="font-semibold text-neutral-700">
              Modifier
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Supprimer la transaction ${transaction.description}`}
            hitSlop={4}
            onPress={() => onDelete?.(transaction)}
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

export const TransactionCard = memo(TransactionCardComponent);
