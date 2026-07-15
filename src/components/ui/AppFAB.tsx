import { Pressable, type PressableProps } from "react-native";
import Animated from "react-native-reanimated";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/utils/cn";
import { useScalePress } from "@/hooks/useScalePress";

export interface AppFABProps extends PressableProps {
  icon?: IconName;
  accessibilityLabel?: string;
}

export function AppFAB({
  icon = "add",
  className,
  onPressIn,
  onPressOut,
  accessibilityLabel = "Ajouter",
  ...props
}: AppFABProps) {
  const { style, onPressIn: scaleIn, onPressOut: scaleOut } = useScalePress(0.92);

  return (
    <Animated.View style={style} className="absolute bottom-6 right-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPressIn={(event) => {
          scaleIn();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scaleOut();
          onPressOut?.(event);
        }}
        className={cn(
          "h-14 w-14 items-center justify-center rounded-full bg-primary-600 shadow-lg shadow-primary-900/30",
          className,
        )}
        {...props}
      >
        <Icon name={icon} size={26} color="#ffffff" />
      </Pressable>
    </Animated.View>
  );
}
