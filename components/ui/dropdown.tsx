import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react-native";
import { Text, View } from "react-native";

export interface DropdownProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: boolean;
}

export function Dropdown({
  placeholder,
  value,
  onChange,
  className,
  error,
}: DropdownProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between border rounded-xl bg-white px-4 h-11",
        error ? "border-red-500" : "border-gray-200",
        className,
      )}
    >
      <Text
        className={cn(
          "text-sm font-figtree",
          value ? "text-primary" : "text-[#8A94A6]",
        )}
      >
        {value || placeholder || "Select option"}
      </Text>
      <ChevronDown size={16} color="#8A94A6" />
    </View>
  );
}
