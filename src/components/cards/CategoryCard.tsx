import { memo } from "react";
import { Pressable, View } from "react-native";
import { AppCard, Text, Icon, type IconName } from "@/components/ui";
import { formatFCFA } from "@/utils/formatFCFA";

export interface CategoryCardData {
  id: number;
  nom: string;
  description: string;
  montant: number;
  nombreTransactions: number;
  icone: IconName;
  couleur: string;
}

export interface CategoryCardProps {
  category: CategoryCardData;
  onEdit?: (category: CategoryCardData) => void;
  onDelete?: (category: CategoryCardData) => void;
}

function CategoryCardComponent({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <AppCard className="gap-4">
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${category.couleur}1A` }}
        >
          <Icon name={category.icone} size={22} color={category.couleur} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text variant="subtitle">{category.nom}</Text>
          <Text variant="caption" numberOfLines={1}>
            {category.description}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-neutral-100 pt-3">
        <View className="gap-0.5">
          <Text variant="caption">Solde</Text>
          <Text variant="subtitle" className="text-base">
            {formatFCFA(category.montant)}
          </Text>
        </View>
        <View className="gap-0.5 items-end">
          <Text variant="caption">Transactions</Text>
          <Text variant="subtitle" className="text-base">
            {category.nombreTransactions}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Modifier la catégorie ${category.nom}`}
          hitSlop={4}
          onPress={() => onEdit?.(category)}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-neutral-100 py-2.5 active:bg-neutral-200"
        >
          <Icon name="create-outline" size={16} color="#374151" />
          <Text variant="caption" className="font-semibold text-neutral-700">
            Modifier
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Supprimer la catégorie ${category.nom}`}
          hitSlop={4}
          onPress={() => onDelete?.(category)}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-danger/10 py-2.5 active:bg-danger/20"
        >
          <Icon name="trash-outline" size={16} color="#dc2626" />
          <Text variant="caption" className="font-semibold text-danger">
            Supprimer
          </Text>
        </Pressable>
      </View>
    </AppCard>
  );
}

export const CategoryCard = memo(CategoryCardComponent);
