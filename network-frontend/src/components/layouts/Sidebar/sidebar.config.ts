// components/layout/Sidebar/sidebar.config.ts
import { Icons } from "@/lib/icons";

export const getSidebarNavItems = (username?: string) => [
  { name: "Trang chủ", icon: Icons.home, href: "/home" },
  {
    name: "Tìm kiếm",
    icon: Icons.search,
    href: "/search",
    triggerCollapse: true,
    overlay: "search"
  },
  { name: "Reels", icon: Icons.reels, href: "/reels" },
  {
    name: "Tin nhắn",
    icon: Icons.messages,
    href: "/direct/inbox", 
    triggerCollapse: true, 
    overlay: "messages" 
  },
  {
    name: "Thông báo",
    icon: Icons.notifications,
    href: "/notifications",
    triggerCollapse: true,
    overlay: "notifications"
  },
  {
    name: "Yêu cầu theo dõi",
    icon: Icons.userPlus,
    href: "/follow-requests",
    // triggerCollapse: true,
    // overlay: "followRequests"
  },
  { name: "Tạo", icon: Icons.create, action: "openPostCreate" },
  {
    name: "Trang cá nhân",
    href: username ? `/in/${username}` : "/login",
    isMyProfile: true,
  },
];
