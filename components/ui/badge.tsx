import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, View } from "react-native";

const badgeVariants = cva("flex-row items-center rounded-full px-2.5 py-0.5", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-[#DCFCE7]",
      warning: "bg-[#FEF3C7]",
      destructive: "bg-[#FEE2E2]",
      secondary: "bg-[#C5D0DD]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const badgeTextVariants = cva("text-sm font-figtree-semibold", {
  variants: {
    variant: {
      default: "text-white",
      success: "text-[#166534]",
      warning: "text-[#92400E]",
      destructive: "text-[#991B1B]",
      secondary: "text-[#081D33]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

function Badge({ className, variant, textClassName, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
        {children}
      </Text>
    </View>
  );
}

export { Badge, badgeVariants };
