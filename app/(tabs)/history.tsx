import { useCallback } from "react";
import { FlatList } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppEmptyState, AppHeader, Screen } from "@/components/ui";
import { TimelineItem, type TimelineItemData } from "@/components/cards";
import { useTimeline } from "@/hooks/useTimeline";

export default function HistoryScreen() {
  const { items } = useTimeline();

  const renderItem = useCallback(
    ({ item, index }: { item: TimelineItemData; index: number }) => (
      <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 40).springify()}>
        <TimelineItem item={item} isLast={index === items.length - 1} />
      </Animated.View>
    ),
    [items.length],
  );

  return (
    <Screen>
      <AppHeader title="Historique" subtitle="Toutes vos opérations dans le temps" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        contentContainerClassName="px-5 pb-10 pt-2"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AppEmptyState
            icon="time-outline"
            title="Aucun historique"
            message="Votre activité récente apparaîtra ici."
          />
        }
      />
    </Screen>
  );
}
