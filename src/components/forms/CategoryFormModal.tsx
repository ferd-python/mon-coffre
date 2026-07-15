import { useEffect } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal, AppButton } from "@/components/ui";
import { FormTextInput } from "./FormTextInput";
import { categoryFormSchema, type CategoryFormValues } from "@/schemas/category.schema";
import { categoryService } from "@/services";
import { useToast } from "@/lib/toast";
import type { CategoryWithStats } from "@/hooks/useCategoriesWithStats";

export interface CategoryFormModalProps {
  visible: boolean;
  onClose: () => void;
  category?: CategoryWithStats | null;
  existingNames: string[];
}

export function CategoryFormModal({
  visible,
  onClose,
  category,
  existingNames,
}: CategoryFormModalProps) {
  const { showToast } = useToast();
  const isEditing = Boolean(category);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { nom: "", description: "" },
  });

  useEffect(() => {
    if (visible) {
      reset({ nom: category?.nom ?? "", description: category?.description ?? "" });
    }
  }, [visible, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const normalizedName = values.nom.trim().toLowerCase();
    if (existingNames.includes(normalizedName)) {
      setError("nom", { message: "Une catégorie avec ce nom existe déjà" });
      return;
    }

    try {
      if (isEditing && category) {
        await categoryService.update(category.id, {
          nom: values.nom.trim(),
          description: values.description?.trim() || null,
        });
        showToast("success", "Catégorie modifiée avec succès");
      } else {
        await categoryService.create({
          nom: values.nom.trim(),
          description: values.description?.trim() || null,
          ordre: 0,
          actif: true,
        });
        showToast("success", "Catégorie créée avec succès");
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
      title={isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
    >
      <View className="gap-4">
        <FormTextInput
          control={control}
          name="nom"
          label="Nom"
          placeholder="Ex: Personnel"
          maxLength={50}
          autoFocus
        />
        <FormTextInput
          control={control}
          name="description"
          label="Description (optionnel)"
          placeholder="Ex: Argent personnel"
          maxLength={200}
        />
        <AppButton
          label={isEditing ? "Enregistrer" : "Créer"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />
      </View>
    </AppModal>
  );
}
