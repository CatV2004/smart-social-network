"use client";

import { ReactElement, ReactNode } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import type { UseFormReturn, FieldValues, SubmitHandler, FieldPath, ControllerRenderProps, ControllerFieldState } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  render: (props: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
  }) => ReactElement;
  className?: string;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, render, className }: FormFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => render({ field, fieldState })}
      />
    </div>
  );
}

interface FormItemProps {
  children: ReactNode;
  className?: string;
}

export function FormItem({ children, className }: FormItemProps) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

interface FormLabelProps {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormLabel({ children, className, htmlFor }: FormLabelProps) {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium ${className || 'text-gray-300'}`}
    >
      {children}
    </label>
  );
}

export function FormControl({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`relative ${className}`}>{children}</div>; 
}

interface FormMessageProps {
  children?: ReactNode;
  className?: string;
}

export function FormMessage({ children, className }: FormMessageProps) {
  if (!children) return null;

  return (
    <p className={`text-sm font-medium ${className || 'text-red-400'}`}>
      {children}
    </p>
  );
}

export function useFormField() {
  return useFormContext();
}