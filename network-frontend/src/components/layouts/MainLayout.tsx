// components/layouts/MainLayout.tsx
"use client";

import { Sidebar } from "./Sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setSidebarCollapse } from "@/redux/features/ui/uiSlice";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn"; // Nếu bạn có utility cn

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.ui.isSidebarCollapsed
  );
  const activeOverlay = useAppSelector((state) => state.ui.activeOverlay);
  const isDirectPage = pathname?.startsWith("/direct");

  useEffect(() => {
    if (activeOverlay === "none") {
      if (isDirectPage && !isSidebarCollapsed) {
        dispatch(setSidebarCollapse(true));
      } else if (!isDirectPage && isSidebarCollapsed) {
        dispatch(setSidebarCollapse(false));
      }
    }
  }, [pathname, isDirectPage, isSidebarCollapsed, dispatch, activeOverlay]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar wrapper */}
      <div className={cn(
        // Điều kiện: chỉ thêm w-1/6 khi KHÔNG phải trang direct
        !isDirectPage && "w-1/6"
      )}>
        <div className={cn(
          "transition-all duration-300",
          isSidebarCollapsed 
            ? "w-[88px]" 
            : "min-w-[88px] lg:min-w-[280px]",
          // Đảm bảo sidebar chiếm full width trong container trên trang direct
        )}>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}