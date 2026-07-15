import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { Icon } from "./Icon";

export interface AppSearchBarProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (value: string) => void;
}

export function AppSearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher…",
  ...props
}: AppSearchBarProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-neutral-100 px-4 py-3">
      <Icon name="search" size={18} color="#6b7280" />
      <TextInput
        className="flex-1 text-base text-neutral-900"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        accessibilityLabel={placeholder}
        {...props}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
        >
          <Icon name="close-circle" size={18} color="#9ca3af" />
        </Pressable>
      ) : null}
    </View>
  );
}
