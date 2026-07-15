import { TextInput, View, type TextInputProps } from "react-native";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Text } from "@/components/ui";
import { cn } from "@/utils/cn";

export interface FormTextInputProps<TFieldValues extends FieldValues>
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
}

export function FormTextInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: FormTextInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View className="gap-1">
          {label ? <Text variant="caption">{label}</Text> : null}
          <TextInput
            className={cn(
              "rounded-xl border bg-neutral-50 px-3.5 py-3 text-base text-neutral-900",
              fieldState.error ? "border-danger" : "border-neutral-200",
              className,
            )}
            placeholderTextColor="#9ca3af"
            accessibilityLabel={label}
            accessibilityState={{ disabled: props.editable === false }}
            value={(field.value as string) ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            {...props}
          />
          {fieldState.error ? (
            <Text variant="caption" className="text-danger" accessibilityLiveRegion="polite">
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
