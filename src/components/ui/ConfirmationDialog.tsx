import { View } from "react-native";
import { AppModal } from "./AppModal";
import { Text } from "./Text";
import { AppButton } from "./AppButton";

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <AppModal visible={visible} onClose={onCancel}>
      <View className="gap-2">
        <Text variant="subtitle">{title}</Text>
        {message ? <Text variant="body" className="text-neutral-500">{message}</Text> : null}
      </View>
      <View className="flex-row gap-3">
        <AppButton
          label={cancelLabel}
          variant="secondary"
          onPress={onCancel}
          fullWidth
          className="flex-1"
        />
        <AppButton
          label={confirmLabel}
          variant={destructive ? "danger" : "primary"}
          onPress={onConfirm}
          fullWidth
          className="flex-1"
        />
      </View>
    </AppModal>
  );
}
