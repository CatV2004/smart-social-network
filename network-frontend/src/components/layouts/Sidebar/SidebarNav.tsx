import { useActiveTab } from "@/hooks/useActiveTab";
import { SidebarNavItem } from "./SidebarNavItem";
import { useAppSelector } from "@/redux/hooks";
import { selectCountUnReadOnly } from "@/redux/features/notifications/notificationSelectors";
import { selectTotalUnreadCount } from "@/redux/features/chat/selectors";

export function SidebarNav({
  items,
  pathname,
  handleItemClick,
  userAvatar,
  isCollapsed,
  isTransitioning,
  activeOverlay,
}: any) {
  const isActiveTab = useActiveTab();
  const unreadCount = useAppSelector(selectCountUnReadOnly);
  const messageUnreadCount = useAppSelector(selectTotalUnreadCount);

  return (
    <ul>
      {items.map((item: any, index: number) => {
        // Xác định badge count cho từng item
        let badgeCount = 0;
        if (item.overlay === "notifications") {
          badgeCount = unreadCount;
        } else if (item.href?.startsWith("/direct")) {
          badgeCount = messageUnreadCount; // Sử dụng cho mục tin nhắn
        }

        return (
          <li key={item.name} className="mb-2">
            <SidebarNavItem
              item={item}
              isActive={isActiveTab(item, activeOverlay)}
              onClick={(e: any) => handleItemClick(e, item)}
              userAvatar={userAvatar}
              isCollapsed={isCollapsed}
              isTransitioning={isTransitioning}
              index={index}
              badgeCount={badgeCount} // Truyền badge count
            />
          </li>
        );
      })}
    </ul>
  );
}
