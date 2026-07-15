import { Pressable, View, type PressableProps, type ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { cn } from "@/utils/cn";
import { useScalePress } from "@/hooks/useScalePress";

const BASE_CLASSNAME =
  "rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm shadow-neutral-300/40";

export interface AppCardProps extends ViewProps {
  onPress?: PressableProps["onPress"];
}

export function AppCard({ className, onPress, ...props }: AppCardProps) {
  const { style, onPressIn, onPressOut } = useScalePress(0.98);

  if (onPress) {
    return (
      <Animated.View style={style} className={className}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className={BASE_CLASSNAME}
          {...(props as PressableProps)}
        />
      </Animated.View>
    );
  }

  return <View className={cn(BASE_CLASSNAME, className)} {...props} />;
}
