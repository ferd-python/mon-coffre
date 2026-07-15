import { ActivityIndicator, Pressable, type PressableProps } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "./Text";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/utils/cn";
import { useScalePress } from "@/hooks/useScalePress";

export type AppButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type AppButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps extends PressableProps {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  icon?: IconName;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSNAMES: Record<AppButtonVariant, string> = {
  primary: "bg-primary-600",
  secondary: "bg-neutral-100",
  outline: "border border-neutral-300 bg-transparent",
  ghost: "bg-transparent",
  danger: "bg-danger",
};

const VARIANT_TEXT_CLASSNAMES: Record<AppButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-neutral-900",
  outline: "text-neutral-900",
  ghost: "text-primary-600",
  danger: "text-white",
};

const VARIANT_ICON_COLORS: Record<AppButtonVariant, string> = {
  primary: "#ffffff",
  secondary: "#111827",
  outline: "#111827",
  ghost: "#2563eb",
  danger: "#ffffff",
};

const SIZE_CLASSNAMES: Record<AppButtonSize, string> = {
  sm: "px-3 py-2 rounded-lg gap-1.5",
  md: "px-4 py-3 rounded-xl gap-2",
  lg: "px-5 py-4 rounded-2xl gap-2",
};

const SIZE_TEXT_CLASSNAMES: Record<AppButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
};

const SIZE_ICON_SIZE: Record<AppButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

export function AppButton({
  label,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  onPressIn,
  onPressOut,
  ...props
}: AppButtonProps) {
  const { style, onPressIn: scaleIn, onPressOut: scaleOut } = useScalePress();
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={style} className={cn(fullWidth && "w-full", className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPressIn={(event) => {
          scaleIn();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scaleOut();
          onPressOut?.(event);
        }}
        className={cn(
          "flex-row items-center justify-center",
          VARIANT_CLASSNAMES[variant],
          SIZE_CLASSNAMES[size],
          isDisabled && "opacity-50",
        )}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={VARIANT_ICON_COLORS[variant]} size="small" />
        ) : (
          <>
            {icon && iconPosition === "left" ? (
              <Icon name={icon} size={SIZE_ICON_SIZE[size]} color={VARIANT_ICON_COLORS[variant]} />
            ) : null}
            <Text
              variant="body"
              className={cn(
                "font-semibold",
                VARIANT_TEXT_CLASSNAMES[variant],
                SIZE_TEXT_CLASSNAMES[size],
              )}
            >
              {label}
            </Text>
            {icon && iconPosition === "right" ? (
              <Icon name={icon} size={SIZE_ICON_SIZE[size]} color={VARIANT_ICON_COLORS[variant]} />
            ) : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
