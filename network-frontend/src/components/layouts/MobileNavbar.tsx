// components/MobileNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import { motion } from "framer-motion";

export default function MobileNavbar() {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentProfile = useAppSelector(selectMyProfile);
  const currentUserId = currentUser?.id;

  const navItems = [
    { name: "Trang chủ", icon: Icons.home, href: "/home", exact: true },
    { name: "Tìm kiếm", icon: Icons.search, href: "/search" },
    { name: "Tạo", icon: Icons.create, href: "/create" },
    { name: "Reels", icon: Icons.reels, href: "/reels" },
    {
      name: "Profile",
      icon: null,
      href: currentUserId ? `/in/${currentUserId}` : "/login",
      isProfile: true,
    },
  ];

  const user = {
    avatar: currentProfile?.avatar || "/default-avatar.jpg",
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50 md:hidden"
    >
      {navItems.map((item) => (
        <motion.div
          key={item.name}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Link
            href={item.href}
            className="flex flex-col items-center justify-center p-2"
          >
            {item.isProfile ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className={`w-6 h-6 rounded-full object-cover ${
                  isActive(item.href) ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ) : item.icon ? (
              <FontAwesomeIcon
                icon={item.icon}
                className={`w-6 h-6 ${
                  isActive(item.href, item.exact)
                    ? "text-black"
                    : "text-gray-600"
                }`}
              />
            ) : (
              <div className="w-6 h-6" />
            )}
            {isActive(item.href, item.exact) && (
              <motion.div
                layoutId="mobileActiveIndicator"
                className="absolute -top-1 right-0 w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
