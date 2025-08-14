// components/ui/dialog.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

// Re-export cơ bản để tiện dùng
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

// Overlay tùy biến
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
      "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// Props mở rộng cho Content
interface CustomDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Hiển thị nút close toàn cục ở góc trên bên phải */
  showCloseButton?: boolean;
  /** Đường dẫn icon hiển thị mờ ở background */
  iconPath?: string;
  /** Class tùy biến cho Overlay */
  overlayClassName?: string;
}

// Content tùy biến
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  CustomDialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      iconPath,
      overlayClassName,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />

      {showCloseButton && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-6 top-6 z-[60] rounded-full p-2 transition",
            "text-white hover:bg-white/10 focus:outline-none"
          )}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}

      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-[min(90vw,1000px)]",
          "-translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl",
          "focus:outline-none",
          "data-[state=open]:animate-dialogIn data-[state=closed]:animate-dialogOut",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {iconPath && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
            <Image
              src={iconPath}
              alt=""
              width={80}
              height={80}
              className="opacity-20"
            />
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
};
