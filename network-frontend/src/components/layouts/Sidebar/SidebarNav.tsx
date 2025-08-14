// components/layout/Sidebar/SidebarNav.tsx
import { SidebarNavItem } from "./SidebarNavItem";

export function SidebarNav({ items, pathname, handleItemClick, userAvatar }: any) {
  return (
    <ul>
      {items.map((item: any) => (
        <li key={item.name} className="mb-4">
          <SidebarNavItem
            item={item}
            isActive={item.href && pathname === item.href}
            onClick={(e: any) => handleItemClick(e, item)}
            userAvatar={userAvatar}
          />
        </li>
      ))}
    </ul>
  );
}
