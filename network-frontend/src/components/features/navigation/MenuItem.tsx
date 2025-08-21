// components/features/navigation/MenuItem.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";

interface MenuItemProps {
  href?: string;
  icon?: IconDefinition;
  label: string;
  hasCheckmark?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

export default function MenuItem({
  href,
  icon,
  label,
  hasCheckmark = false,
  isDanger = false,
  onClick,
}: MenuItemProps) {
  const content = (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between py-3 px-4 ${
        isDanger ? "text-red-500" : "text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`w-5 h-5 ${isDanger ? "text-red-500" : "text-gray-700"}`}
          />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasCheckmark && (
        <FontAwesomeIcon icon={Icons.check} className="w-4 h-4 text-blue-500" />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:bg-gray-50">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full text-left hover:bg-gray-50">
      {content}
    </button>
  );
}
