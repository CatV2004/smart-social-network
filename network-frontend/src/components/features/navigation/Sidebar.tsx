import NavItem from "@/components/features/navigation/NavItem";
import {
  HomeIcon,
  SearchIcon,
  ExploreIcon,
  ReelsIcon,
  MessagesIcon,
  NotificationsIcon,
  CreateIcon,
  ProfileIcon,
  MoreIcon,
} from "@/components/ui/Icons";

export default function Sidebar() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8 px-2">Instagram</h1>

      <nav>
        <ul className="space-y-2">
          <NavItem icon={<HomeIcon />} text="Trang chủ" active />
          <NavItem icon={<SearchIcon />} text="Tìm kiếm" />
          <NavItem icon={<ExploreIcon />} text="Khám phá" />
          <NavItem icon={<ReelsIcon />} text="Reels" />
          <NavItem icon={<MessagesIcon />} text="Tin nhắn" />
          <NavItem icon={<NotificationsIcon />} text="Thông báo" />
          <NavItem icon={<CreateIcon />} text="Tạo" />
          <NavItem icon={<ProfileIcon />} text="Trang cá nhân" />
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <NavItem icon={<MoreIcon />} text="Xem thêm" />
        <p className="text-xs text-gray-500 mt-4">© 2023 Instagram from Meta</p>
      </div>
    </div>
  );
}
