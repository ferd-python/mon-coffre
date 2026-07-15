import { Text as RNText, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

export type AppTextVariant = "body" | "title" | "subtitle" | "caption";

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
}

const VARIANT_CLASSNAMES: Record<AppTextVariant, string> = {
  body: "text-base text-neutral-900",
  title: "text-2xl font-bold text-neutral-900",
  subtitle: "text-lg font-semibold text-neutral-800",
  caption: "text-sm text-neutral-500",
};

export function Text({ variant = "body", className, ...props }: AppTextProps) {
  return (
    <RNText className={cn(VARIANT_CLASSNAMES[variant], className)} {...props} />
  );
}
