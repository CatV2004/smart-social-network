"use client";

import { User } from "@/types/user";
import { MailIcon, LockIcon } from "@/components/ui/Icons";

interface ProfileInfoProps {
  user: User;
  isPrivate: boolean;
}

export function ProfileInfo({ user, isPrivate }: ProfileInfoProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
        {isPrivate && <LockIcon className="w-5 h-5 text-gray-500" />}
      </div>

      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <span className="text-sm">@{user.email.split("@")[0]}</span>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1 text-sm">
          <MailIcon className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}
