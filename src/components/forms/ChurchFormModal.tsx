import { useEffect } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal, AppButton } from "@/components/ui";
import { FormTextInput } from "./FormTextInput";
import {
  churchContributionFormSchema,
  type ChurchContributionFormValues,
} from "@/schemas/church.schema";
import { churchService } from "@/services";
import { useToast } from "@/lib/toast";
import { getTodayDateString } from "@/utils/formatDate";
import type { ChurchContribution } from "@/types";

export interface ChurchFormModalProps {
  visible: boolean;
  onClose: () => void;
  contribution?: ChurchContribution | null;
}

export function ChurchFormModal({ visible, onClose, contribution }: ChurchFormModalProps) {
  const { showToast } = useToast();
  const isEditing = Boolean(contribution);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChurchContributionFormValues>({
    resolver: zodResolver(churchContributionFormSchema),
    defaultValues: {
      date: getTodayDateString(),
      seme: "",
      funerailles: "",
      commentaire: "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        date: contribution?.date ?? getTodayDateString(),
        seme: contribution ? String(contribution.seme) : "",
        funerailles: contribution ? String(contribution.funerailles) : "",
        commentaire: contribution?.commentaire ?? "",
      });
    }
  }, [visible, contribution, reset]);

  const onSubmit = async (values: ChurchContributionFormValues) => {
    try {
      const payload = {
        date: values.date,
        seme: Number(values.seme || 0),
        funerailles: Number(values.funerailles || 0),
        commentaire: values.commentaire?.trim() || null,
      };

      if (isEditing && contribution) {
        await churchService.update(contribution.id, payload);
        showToast("success", "Cotisation modifiée avec succès");
      } else {
        await churchService.create(payload);
        showToast("success", "Cotisation ajoutée avec succès");
      }
      onClose();
    } catch {
      showToast("error", "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Modifier la cotisation" : "Nouvelle cotisation"}
    >
      <View className="gap-4">
        <FormTextInput
          control={control}
          name="date"
          label="Date"
          placeholder="AAAA-MM-JJ"
          maxLength={10}
        />
        <FormTextInput
          control={control}
          name="seme"
          label="Sème (FCFA)"
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={15}
        />
        <FormTextInput
          control={control}
          name="funerailles"
          label="Funérailles (FCFA)"
          placeholder="0"
          keyboardType="decimal-pad"
          maxLength={15}
        />
        <FormTextInput
          control={control}
          name="commentaire"
          label="Commentaire (optionnel)"
          placeholder="Ex: Offrande spéciale"
          maxLength={200}
        />
        <AppButton
          label={isEditing ? "Enregistrer" : "Ajouter"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />
      </View>
    </AppModal>
  );
}
