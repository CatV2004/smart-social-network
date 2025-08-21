// components/layout/Sidebar/sidebar.config.ts
import { Icons } from "@/lib/icons";

export const getSidebarNavItems = (username?: string) => [
  { name: "Trang chủ", icon: Icons.home, href: "/" },
  {
    name: "Tìm kiếm",
    icon: Icons.search,
    href: "/search",
    triggerCollapse: true,
    overlay: "search"
  },
  { name: "Khám phá", icon: Icons.explore, href: "/explore" },
  { name: "Reels", icon: Icons.reels, href: "/reels" },
  { name: "Tin nhắn", icon: Icons.messages, href: "/messages" },
  {
    name: "Thông báo",
    icon: Icons.notifications,
    href: "/notifications",
    triggerCollapse: true,
    overlay: "notifications"
  },
  { name: "Tạo", icon: Icons.create, action: "openPostCreate" },
  {
    name: "Trang cá nhân",
    href: username ? `/in/${username}` : "/login",
    isMyProfile: true,
  },
];
