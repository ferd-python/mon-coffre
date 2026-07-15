import { Modal, Pressable, View, type ViewProps } from "react-native";
import type { ReactNode } from "react";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";

export interface AppModalProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function AppModal({ visible, onClose, title, children, className, ...props }: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end bg-black/40"
        onPress={onClose}
        accessibilityLabel="Fermer la fenêtre"
      >
        <View
          onStartShouldSetResponder={() => true}
          className={cn("gap-4 rounded-t-3xl bg-white px-5 pb-8 pt-5", className)}
          {...props}
        >
          <View className="self-center h-1.5 w-12 rounded-full bg-neutral-200" />
          {title ? (
            <View className="flex-row items-center justify-between">
              <Text variant="subtitle">{title}</Text>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <Icon name="close" size={22} color="#6b7280" />
              </Pressable>
            </View>
          ) : null}
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}
