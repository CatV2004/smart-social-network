"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/lib/icons";
import MenuItem from "./MenuItem";
import MenuDivider from "./MenuDivider";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Nút trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <FontAwesomeIcon icon={faBars} className="w-6 h-6 text-black" />
        <span className="text-[15px] font-normal text-black">Xem thêm</span>
      </div>

      {/* Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-0 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
          >
            <MenuItem label="Cài đặt" icon={Icons.settings} hasCheckmark />
            <MenuItem label="Hoạt động của bạn" icon={Icons.activity} hasCheckmark />
            <MenuItem label="Đã lưu" icon={Icons.bookmark} hasCheckmark />

            <MenuDivider />

            <MenuItem label="Chuyển chế độ" icon={Icons.moon} />

            <MenuDivider />

            <MenuItem label="Báo cáo sự cố" icon={Icons.flag} />
            <MenuItem label="Chuyển tài khoản" icon={Icons.switch} />

            <MenuDivider />

            <MenuItem
              label="Đăng xuất"
              icon={Icons.logout}
              isDanger
              onClick={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
