// hooks/useActiveTab.ts
import { useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";

export function useActiveTab() {
    const pathname = usePathname();
    const activeOverlay = useAppSelector((s) => s.ui.activeOverlay);

    return (item: { href?: string; overlay?: string; action?: string }, currentActiveOverlay?: string) => {
        const effectiveOverlay = currentActiveOverlay !== undefined ? currentActiveOverlay : activeOverlay;

        // Kiểm tra overlay trước - nếu overlay khớp thì active
        if (item.overlay && effectiveOverlay === item.overlay) {
            return true;
        }

        // Kiểm tra trang tin nhắn - luôn active khi ở trang direct
        if (item.href?.startsWith('/direct') && pathname?.startsWith('/direct')) {
            return true;
        }

        // Kiểm tra đường dẫn thông thường - chỉ active khi không có overlay active
        if (item.href && pathname === item.href && effectiveOverlay === "none") {
            return true;
        }

        return false;
    };
}