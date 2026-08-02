import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable, PressableProps, Text } from "react-native";

const buttonVariants = cva("flex-row items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-primary",
      outline: "bg-transparent border border-gray-200",
      secondary: "bg-[#EEF2F6] border border-[#E2E8F0]",
      ghost: "bg-transparent",
    },
    size: {
      default: "h-11 px-6",
      sm: "h-9 px-4 rounded-lg",
      lg: "h-12 px-8 rounded-xl",
      icon: "h-11 w-11",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = cva("font-figtree-semibold text-sm", {
  variants: {
    variant: {
      default: "text-white",
      outline: "text-primary",
      secondary: "text-primary",
      ghost: "text-primary",
    },
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends PressableProps, VariantProps<typeof buttonVariants> {
  className?: string;
  textClassName?: string;
}

const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, textClassName, children, ...props }, ref) => {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
