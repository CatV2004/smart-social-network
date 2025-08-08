"use client";

import { createContext, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

const FormContext = createContext<UseFormReturn<any> | null>(null);

export function FormProvider({ children, ...props }: any) {
  const methods = useForm(props);
  
  return (
    <FormContext.Provider value={methods}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}