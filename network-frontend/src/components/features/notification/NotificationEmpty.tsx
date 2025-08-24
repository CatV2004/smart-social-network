"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export function NotificationEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="p-8 text-center text-gray-500"
    >
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-gray-400" />
      </div>
      <p className="font-medium">Không có thông báo</p>
      <p className="text-sm mt-1">Tất cả thông báo sẽ xuất hiện ở đây</p>
    </motion.div>
  );
}
