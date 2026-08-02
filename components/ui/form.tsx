import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Text, View } from "react-native";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const error = formState.errors[fieldContext.name];

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
    error,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View> & { fullWidth?: boolean }
>(({ className, fullWidth, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View
        ref={ref}
        className={cn("mb-6", fullWidth ? "w-full" : "w-[48%]", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Text>,
  React.ComponentProps<typeof Text> & { required?: boolean }
>(({ className, required, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <Text
      ref={ref}
      className={cn(
        "text-sm font-figtree-semibold text-primary mb-2",
        error && "text-red-500",
        className,
      )}
      {...props}
    >
      {props.children} {required && <Text className="text-[#E02424]">*</Text>}
    </Text>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View>
>(({ ...props }, ref) => {
  const { error } = useFormField();

  return (
    <View
      ref={ref}
      className={cn(error && "border border-red-500 rounded-xl")}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  React.ComponentRef<typeof Text>,
  React.ComponentProps<typeof Text> & { error?: any }
>(({ className, children, error: propError, ...props }, ref) => {
  const { error: contextError } = useFormField();
  const error = propError || contextError;
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <Text
      ref={ref}
      className={cn(
        "text-[13px] font-figtree-semibold text-red-500 mt-1.5",
        className,
      )}
      {...props}
    >
      {body}
    </Text>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
