import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function useScalePress(toValue = 0.96) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(toValue, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return { style, onPressIn, onPressOut };
}
