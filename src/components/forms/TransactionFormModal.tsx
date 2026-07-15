import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppModal, AppButton, Text } from "@/components/ui";
import { FormTextInput } from "./FormTextInput";
import { transactionFormSchema, type TransactionFormValues } from "@/schemas/transaction.schema";
import { transactionService } from "@/services";
import { useToast } from "@/lib/toast";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { getTodayDateString } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import type { Transaction, TransactionType } from "@/types";

export interface TransactionFormModalProps {
  visible: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "ENTREE", label: "Entrée" },
  { value: "SORTIE", label: "Sortie" },
];

export function TransactionFormModal({ visible, onClose, transaction }: TransactionFormModalProps) {
  const { showToast } = useToast();
  const { data: categories } = useCategoriesQuery();
  const isEditing = Boolean(transaction);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      categorieId: 0,
      type: "SORTIE",
      montant: "",
      description: "",
      dateOperation: getTodayDateString(),
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        categorieId: transaction?.categorieId ?? categories[0]?.id ?? 0,
        type: transaction?.type ?? "SORTIE",
        montant: transaction ? String(transaction.montant) : "",
        description: transaction?.description ?? "",
        dateOperation: transaction?.dateOperation ?? getTodayDateString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, transaction, reset]);

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      const payload = {
        categorieId: values.categorieId,
        type: values.type,
        montant: Number(values.montant),
        description: values.description?.trim() || null,
        dateOperation: values.dateOperation,
      };

      if (isEditing && transaction) {
        await transactionService.update(transaction.id, payload);
        showToast("success", "Transaction modifiée avec succès");
      } else {
        await transactionService.create(payload);
        showToast("success", "Transaction créée avec succès");
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
      title={isEditing ? "Modifier la transaction" : "Nouvelle transaction"}
    >
      <ScrollView className="max-h-[70vh]" showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View className="gap-1.5">
            <Text variant="caption">Catégorie</Text>
            <Controller
              control={control}
              name="categorieId"
              render={({ field, fieldState }) => (
                <View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                      {categories.map((category) => {
                        const isActive = field.value === category.id;
                        return (
                          <Pressable
                            key={category.id}
                            accessibilityRole="button"
                            accessibilityLabel={`Catégorie ${category.nom}`}
                            accessibilityState={{ selected: isActive }}
                            onPress={() => field.onChange(category.id)}
                            className={cn(
                              "rounded-full px-4 py-2",
                              isActive ? "bg-primary-600" : "bg-neutral-100",
                            )}
                          >
                            <Text
                              variant="caption"
                              className={cn(
                                "font-semibold",
                                isActive ? "text-white" : "text-neutral-600",
                              )}
                            >
                              {category.nom}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                  {fieldState.error ? (
                    <Text variant="caption" className="text-danger mt-1">
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <View className="gap-1.5">
            <Text variant="caption">Type</Text>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <View className="flex-row gap-2">
                  {TYPE_OPTIONS.map((option) => {
                    const isActive = field.value === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="button"
                        accessibilityLabel={`Type ${option.label}`}
                        accessibilityState={{ selected: isActive }}
                        onPress={() => field.onChange(option.value)}
                        className={cn(
                          "flex-1 items-center rounded-xl py-3",
                          isActive
                            ? option.value === "ENTREE"
                              ? "bg-success"
                              : "bg-danger"
                            : "bg-neutral-100",
                        )}
                      >
                        <Text
                          variant="body"
                          className={cn(
                            "font-semibold",
                            isActive ? "text-white" : "text-neutral-600",
                          )}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
          </View>

          <FormTextInput
            control={control}
            name="montant"
            label="Montant (FCFA)"
            placeholder="0"
            keyboardType="decimal-pad"
            maxLength={15}
          />
          <FormTextInput
            control={control}
            name="description"
            label="Description (optionnel)"
            placeholder="Ex: Courses alimentaires"
            maxLength={200}
          />
          <FormTextInput
            control={control}
            name="dateOperation"
            label="Date"
            placeholder="AAAA-MM-JJ"
            maxLength={10}
          />

          <AppButton
            label={isEditing ? "Enregistrer" : "Créer"}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </AppModal>
  );
}
