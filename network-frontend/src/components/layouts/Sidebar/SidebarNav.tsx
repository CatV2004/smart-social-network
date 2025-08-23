// components/layout/Sidebar/SidebarNav.tsx
import { useActiveTab } from "@/hooks/useActiveTab";
import { SidebarNavItem } from "./SidebarNavItem";
import { useAppSelector } from "@/redux/hooks";
import { selectCountUnReadOnly } from "@/redux/features/notifications/notificationSelectors";

export function SidebarNav({
  items,
  pathname,
  handleItemClick,
  userAvatar,
  isCollapsed,
  isTransitioning,
  activeOverlay, // Nhận activeOverlay từ props
}: any) {
  const isActiveTab = useActiveTab();
  const unreadCount = useAppSelector(selectCountUnReadOnly);

  return (
    <ul>
      {items.map((item: any, index: number) => (
        <li key={item.name} className="mb-2">
          <SidebarNavItem
            item={item}
            isActive={isActiveTab(item, activeOverlay)}
            onClick={(e: any) => handleItemClick(e, item)}
            userAvatar={userAvatar}
            isCollapsed={isCollapsed}
            isTransitioning={isTransitioning}
            index={index}
            badgeCount={item.overlay === "notifications" ? unreadCount : 0}
          />
        </li>
      ))}
    </ul>
  );
}
