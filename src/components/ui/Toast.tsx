import { useEffect } from "react";
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { cn } from "@/utils/cn";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  type: ToastType;
  message: string;
}

const TYPE_CONFIG: Record<ToastType, { icon: IconName; className: string }> = {
  success: { icon: "checkmark-circle", className: "bg-success" },
  error: { icon: "alert-circle", className: "bg-danger" },
  info: { icon: "information-circle", className: "bg-primary-600" },
};

export function Toast({ type, message }: ToastProps) {
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
  }, [scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const config = TYPE_CONFIG[type];

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      exiting={FadeOutUp}
      style={style}
      className="absolute left-5 right-5 top-14 z-50"
    >
      <Animated.View
        accessible
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        className={cn(
          "flex-row items-center gap-3 rounded-2xl px-4 py-3.5 shadow-lg shadow-black/20",
          config.className,
        )}
      >
        <Icon name={config.icon} size={22} color="#ffffff" />
        <Text variant="body" className="flex-1 font-semibold text-white">
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
