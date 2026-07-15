import { View, type ViewProps } from "react-native";
import type { ReactNode } from "react";
import { Text } from "./Text";
import { cn } from "@/utils/cn";

export interface AppHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function AppHeader({ title, subtitle, right, className, ...props }: AppHeaderProps) {
  return (
    <View
      className={cn("flex-row items-center justify-between px-5 pb-4 pt-2", className)}
      {...props}
    >
      <View className="flex-1 gap-0.5">
        <Text variant="title">{title}</Text>
        {subtitle ? <Text variant="caption">{subtitle}</Text> : null}
      </View>
      {right ? <View className="ml-3">{right}</View> : null}
    </View>
  );
}
