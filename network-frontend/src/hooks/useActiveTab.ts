// hooks/useActiveTab.ts
import { useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";

export function useActiveTab() {
    const pathname = usePathname();
    const activeOverlay = useAppSelector((s) => s.ui.activeOverlay);

    return (item: { href?: string; overlay?: string }, currentActiveOverlay?: string) => {
        const effectiveOverlay = currentActiveOverlay !== undefined ? currentActiveOverlay : activeOverlay;

        if (item.overlay && effectiveOverlay === item.overlay) return true;
        if (item.href && pathname === item.href && effectiveOverlay === "none") return true;
        return false;
    };
}