import { cn } from "@/lib/utils";
import * as React from "react";
import { TextInput, type TextInputProps, View } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  InputProps
>(({ className, wrapperClassName, icon, error, ...props }, ref) => {
  return (
    <View
      className={cn(
        "flex-row items-center border rounded-xl bg-white px-4 h-11",
        error ? "border-red-500" : "border-gray-200",
        wrapperClassName,
      )}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <TextInput
        className={cn(
          "flex-1 text-sm font-figtree text-primary outline-none",
          className,
        )}
        placeholderTextColor="#8A94A6"
        ref={ref}
        style={{ outlineStyle: "none" } as any}
        {...props}
      />
    </View>
  );
});
Input.displayName = "Input";

export { Input };
