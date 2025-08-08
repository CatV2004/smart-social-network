import type { UseFormReturn, FieldValues } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  children: React.ReactNode;
  className?: string;
};

export type FormFieldProps = {
  name: string;
  render: (props: {
    field: any;
    fieldState: any;
    formState: any;
  }) => React.ReactNode;
};