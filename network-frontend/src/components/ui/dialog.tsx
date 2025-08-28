// components/ui/dialog.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  /** Độ tối nền (0–100), mặc định 30 */
  dimOpacity?: number;
  /** Có làm mờ nền không */
  blur?: boolean | string; // true => sm, string => custom tailwind blur
}

// Re-export cơ bản để tiện dùng
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

// Overlay tùy biến
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, dimOpacity = 30, blur = false, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      `bg-black/${dimOpacity}`, // truyền opacity động
      blur === true
        ? "backdrop-blur-sm"
        : typeof blur === "string"
        ? `backdrop-blur-${blur}`
        : "",
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
  /** Props cho Overlay */
  overlayProps?: DialogOverlayProps;
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
      overlayProps,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      {/* Overlay */}
      <DialogOverlay {...overlayProps} />

      {/* Close button */}
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

      {/* Content */}
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

// Header wrapper
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left p-4 border-b",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Footer wrapper
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 border-t",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
};
