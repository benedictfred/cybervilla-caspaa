import * as React from "react";
import { Pressable, Text, View, Modal, ScrollView, Platform } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { cn } from "../../lib/utils";

export interface DropdownProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: boolean;
  options?: string[];
}

export function Dropdown({
  placeholder,
  value,
  onChange,
  className,
  error,
  options = [],
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
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
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable 
          className="flex-1 justify-center items-center bg-black/20" 
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="bg-white rounded-xl shadow-xl w-[90%] max-w-[320px] max-h-[300px] overflow-hidden"
            onPress={(e) => e.stopPropagation()}
            style={Platform.OS === 'web' ? { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' } : {}}
          >
            <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
              {options.length === 0 ? (
                <Text className="p-4 text-center text-sm font-figtree text-[#8A94A6]">
                  No options available
                </Text>
              ) : (
                options.map((opt, i) => (
                  <Pressable
                    key={i}
                    className={cn(
                      "flex-row items-center justify-between px-4 py-3 border-b border-gray-50",
                      i === options.length - 1 && "border-b-0",
                    )}
                    onPress={() => {
                      onChange?.(opt);
                      setIsOpen(false);
                    }}
                  >
                    <Text
                      className={cn(
                        "text-sm font-figtree",
                        value === opt
                          ? "text-primary font-figtree-semibold"
                          : "text-[#545F71]",
                      )}
                    >
                      {opt}
                    </Text>
                    {value === opt && <Check size={16} color="#0A2540" />}
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
