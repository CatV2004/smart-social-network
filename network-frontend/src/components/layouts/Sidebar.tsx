"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { name: "Trang chủ", icon: Icons.home, href: "/" },
  { name: "Tìm kiếm", icon: Icons.search, href: "/search" },
  { name: "Khám phá", icon: Icons.explore, href: "/explore" },
  { name: "Reels", icon: Icons.reels, href: "/reels" },
  { name: "Tin nhắn", icon: Icons.messages, href: "/messages" },
  { name: "Thông báo", icon: Icons.notifications, href: "/notifications" },
  { name: "Tạo", icon: Icons.create, href: "/create" },
  { name: "Trang cá nhân", icon: null, href: "/profile", isProfile: true },
];
const user = {
  avatar: "https://res.cloudinary.com/dohsfqs6d/image/upload/v1754206154/avatarDefault_nbrjul.jpg",
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="fixed top-0 left-0 h-full nav-medium-sidebar z-10 p-6 hidden md:flex flex-col border-r border-gray-200">
      <div className="mb-10 mt-5 text-center">
        <Link href="/">
          <h1
            style={{ fontFamily: "var(--font-playwrite)" }}
            className="text-2xl font-bold italic text-black cursor-pointer"
          >
            Smart Social
          </h1>
        </Link>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.href}
                className="text-2xl flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                {item.isProfile ? ( 
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : item.icon ? (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-6 h-6 text-black"
                  />
                ) : null}

                <span
                  className={`text-[17px] text-black ${
                    isActive(item.href) ? "font-bold" : "font-normal"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <Link
          href="/menu"
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-black" />
          <span className="text-[15px] font-normal text-black">Xem thêm</span>
        </Link>
      </div>
    </aside>
  );
}
