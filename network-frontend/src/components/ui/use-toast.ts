import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner'; // assuming you're using `sonner` or similar library

type ToastVariant = 'default' | 'destructive';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export const useToast = () => {
  const toast = useCallback((options: ToastOptions) => {
    const { title, description, variant = 'default', duration = 3000 } = options;

    sonnerToast[variant === 'destructive' ? 'error' : 'info'](title, {
      description,
      duration,
    });
  }, []);

  return { toast };
};
