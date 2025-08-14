// components/layout/Sidebar/SidebarNavItem.tsx
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SidebarNavItem({ item, isActive, onClick, userAvatar }: any) {
  if (item.action) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left text-2xl flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <FontAwesomeIcon icon={item.icon} className="w-6 h-6 text-black" />
        <span className="text-[17px] text-black">{item.name}</span>
      </button>
    );
  }

  return (
    <Link
      href={item.href!}
      prefetch={false}
      onClick={onClick}
      className="text-2xl flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition"
    >
      {item.isMyProfile ? (
        <img src={userAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
      ) : item.icon ? (
        <FontAwesomeIcon icon={item.icon} className="w-6 h-6 text-black" />
      ) : null}
      <span
        className={`text-[17px] text-black ${
          isActive ? "font-bold" : "font-normal"
        }`}
      >
        {item.name}
      </span>
    </Link>
  );
}
