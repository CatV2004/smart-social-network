import {
  Bookmark,
  Calendar,
  Camera,
  Grid,
  Heart,
  Link,
  MapPin,
  MessageSquare,
  Play,
  Settings,
  UserIcon,
} from "lucide-react";
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiFilm,
  FiMessageSquare,
  FiHeart,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";

export const HomeIcon = () => <FiHome size={24} />;
export const SearchIcon = () => <FiSearch size={24} />;
export const ExploreIcon = () => <FiCompass size={24} />;
export const ReelsIcon = () => <FiFilm size={24} />;
export const MessagesIcon = () => <FiMessageSquare size={24} />;
export const NotificationsIcon = () => <FiHeart size={24} />;
export const CreateIcon = () => <FiPlusSquare size={24} />;
export const ProfileIcon = () => <FiUser size={24} />;
export const MoreIcon = () => <FiMoreHorizontal size={24} />;

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <Settings {...props} />;
};

export const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <Bookmark {...props} />;
};

export const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <Link {...props} />;
};

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <MapPin {...props} />;
};

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <Calendar {...props} />;
};

export const GenderIcon = (props: React.SVGProps<SVGSVGElement>) => {
  // Dùng icon "User" đại diện cho giới tính
  return <UserIcon {...props} />;
};

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <Camera {...props} />;
};

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Heart {...props} />
);
export const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <MessageSquare {...props} />
);
export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Play {...props} />
);

export const GridIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Grid {...props} />
);
