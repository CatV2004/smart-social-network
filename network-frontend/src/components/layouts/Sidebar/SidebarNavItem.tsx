// components/layout/Sidebar/SidebarNavItem.tsx
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";

export function SidebarNavItem({
  item,
  isActive,
  onClick,
  userAvatar,
  isCollapsed,
  isTransitioning,
  index,
  badgeCount,
}: any) {
  // Thêm class background khi active
  const containerClass = `w-full text-left text-2xl flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden ${
    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-black"
  }`;

  // Xác định xem có nên hiển thị badge không
  const shouldShowBadge =
    badgeCount > 0 &&
    (item.overlay === "notifications" || item.href?.startsWith("/direct"));

  if (item.action) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={onClick}
        className={containerClass}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon
              icon={item.icon}
              className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-black"}`}
            />
          </div>

          <div className="ml-3 overflow-hidden">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="text"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-[17px] whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden"
    >
      <Link
        href={item.href!}
        prefetch={false}
        onClick={onClick}
        className={containerClass} // Sử dụng class dynamic
      >
        <div className="flex items-center w-full">
          <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
            {item.isMyProfile ? (
              <motion.img
                src={userAvatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            ) : item.icon ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-6 h-6 ${
                    isActive ? "text-blue-600" : "text-black"
                  }`}
                />
              </motion.div>
            ) : null}

            {/* Hiển thị badge nếu có số lượng và là mục thông báo hoặc tin nhắn */}
            {shouldShowBadge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {badgeCount > 9 ? "9+" : badgeCount}
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                key="text-visible"
                initial={{ opacity: 0, width: 0, x: -10 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-[17px] transition-colors duration-300 whitespace-nowrap overflow-hidden ml-3"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  );
}
