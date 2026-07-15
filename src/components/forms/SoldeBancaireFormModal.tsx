import { useEffect } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal, AppButton } from "@/components/ui";
import { FormTextInput } from "./FormTextInput";
import { soldeBancaireFormSchema, type SoldeBancaireFormValues } from "@/schemas/settings.schema";
import { settingsService } from "@/services";
import { useToast } from "@/lib/toast";

export interface SoldeBancaireFormModalProps {
  visible: boolean;
  onClose: () => void;
  soldeBancaire: number;
}

export function SoldeBancaireFormModal({ visible, onClose, soldeBancaire }: SoldeBancaireFormModalProps) {
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SoldeBancaireFormValues>({
    resolver: zodResolver(soldeBancaireFormSchema),
    defaultValues: { soldeBancaire: "" },
  });

  useEffect(() => {
    if (visible) {
      reset({ soldeBancaire: String(soldeBancaire) });
    }
  }, [visible, soldeBancaire, reset]);

  const onSubmit = async (values: SoldeBancaireFormValues) => {
    try {
      await settingsService.updateSoldeBancaire(Number(values.soldeBancaire));
      showToast("success", "Solde bancaire mis à jour avec succès");
      onClose();
    } catch {
      showToast("error", "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <AppModal visible={visible} onClose={onClose} title="Modifier le solde bancaire">
      <View className="gap-4">
        <FormTextInput
          control={control}
          name="soldeBancaire"
          label="Solde bancaire (FCFA)"
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={15}
          autoFocus
        />
        <AppButton label="Enregistrer" onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />
      </View>
    </AppModal>
  );
}
