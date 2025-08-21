// components/layout/Sidebar/SidebarNav.tsx
import { useActiveTab } from "@/hooks/useActiveTab";
import { SidebarNavItem } from "./SidebarNavItem";

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

  return (
    <ul>
      {items.map((item: any, index: number) => (
        <li key={item.name} className="mb-2">
          <SidebarNavItem
            item={item}
            isActive={isActiveTab(item, activeOverlay)} // Truyền activeOverlay
            onClick={(e: any) => handleItemClick(e, item)}
            userAvatar={userAvatar}
            isCollapsed={isCollapsed}
            isTransitioning={isTransitioning}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
}
