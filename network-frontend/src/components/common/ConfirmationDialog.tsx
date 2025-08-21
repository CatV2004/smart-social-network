"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode; 
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode; 
  confirmVariant?: "danger" | "primary";
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  icon,
  confirmVariant = "primary",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Icon */}
          {icon && <div>{icon}</div>}

          {/* Title & description */}
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-sm text-gray-600">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {/* Action buttons */}
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <AlertDialogCancel className="flex-1 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={`flex-1 h-11 rounded-lg text-white transition-colors ${
                confirmVariant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
