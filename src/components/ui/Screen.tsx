import { SafeAreaView, type ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export function Screen({ className, ...props }: ViewProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-neutral-50", className)} {...props} />
  );
}
