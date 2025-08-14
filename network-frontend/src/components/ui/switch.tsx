import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils/cn";
import { Check, X } from "lucide-react"; 

const colorVariants: Record<string, string> = {
  blue: "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-700",
  pink: "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-pink-700",
};

export const FancySwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    color?: keyof typeof colorVariants;
  }
>(({ className, color = "blue", ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-inner transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-300",
      colorVariants[color],
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    >
      <Check className="w-3 h-3 text-green-500 data-[state=unchecked]:hidden" />
      <X className="w-3 h-3 text-gray-400 data-[state=checked]:hidden" />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
FancySwitch.displayName = "FancySwitch";
