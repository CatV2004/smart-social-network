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
  Phone,
  Lock,
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
  FiMoreHorizontal,
} from "react-icons/fi";
import { FaFacebook, FaLinkedin, FaGithub, FaMailchimp, FaEnvelope } from "react-icons/fa";

export const HomeIcon = () => <FiHome size={24} />;
export const SearchIcon = () => <FiSearch size={24} />;
export const ExploreIcon = () => <FiCompass size={24} />;
export const ReelsIcon = () => <FiFilm size={24} />;
export const MessagesIcon = () => <FiMessageSquare size={24} />;
export const NotificationsIcon = () => <FiHeart size={24} />;
export const CreateIcon = () => <FiPlusSquare size={24} />;
export const ProfileIcon = () => <FiUser size={24} />;
export const MoreIcon = () => <FiMoreHorizontal size={24} />;

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Settings {...props} />
);

export const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Bookmark {...props} />
);

export const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Link {...props} />
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <MapPin {...props} />
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Calendar {...props} />
);

export const GenderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <UserIcon {...props} />
);

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Camera {...props} />
);

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

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Phone {...props} />
);

export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Lock {...props} />
);

export const FacebookIcon = ({
  size,
  color,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) => <FaFacebook size={size} color={color} className={className} />;

export const LinkedinIcon = ({
  size,
  color,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) => <FaLinkedin size={size} color={color} className={className} />;

export const GithubIcon = ({
  size,
  color,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) => <FaGithub size={size} color={color} className={className} />;

export const MailIcon = ({
  size,
  color,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) => <FaEnvelope  size={size} color={color} className={className} />;
