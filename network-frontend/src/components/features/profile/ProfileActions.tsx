"use client";

import { Button } from "@/components/ui/button";
import {
  SettingsIcon,
  UserCheck,
  UserPlus,
  MessageCircle,
  Clock,
  ChevronDown,
  UserX,
  X,
} from "lucide-react";
import { useFollow } from "@/hooks/useFollow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileActionsProps {
  isCurrentUser: boolean;
  isUploading: boolean;
  userId: string;
  onEdit: () => void;
  onMessage: () => void;
}

export function ProfileActions({
  isCurrentUser,
  isUploading,
  userId,
  onEdit,
  onMessage,
}: ProfileActionsProps) {
  const { followStatus, isLoading, handleFollow, handleUnfollow } = useFollow({
    userId,
  });


  if (isCurrentUser) {
    return (
      <Button
        variant="ghost"
        className="gap-2 rounded-full bg-gray-100/50 hover:bg-gray-200/70 text-gray-700 transition px-4 py-2 h-10 shadow-sm"
        onClick={onEdit}
        disabled={isUploading}
      >
        <SettingsIcon className="w-4 h-4" />
        Chỉnh sửa hồ sơ
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {followStatus === "ACCEPTED" ? (
        // Case 1: Đang theo dõi
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer gap-2 rounded-full bg-gray-100/50 hover:bg-gray-200/70 text-blue-600 transition px-4 py-2 h-10 shadow-sm"
              disabled={isLoading}
            >
              <UserCheck className="w-4 h-4" />
              Đang theo dõi
              <ChevronDown className="w-4 h-4" />
              {isLoading && <span className="ml-1 animate-pulse">...</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-lg shadow-lg border border-gray-100"
          >
            <DropdownMenuItem
              onClick={handleUnfollow}
              className="cursor-pointer flex items-center cursor-pointer text-red-600 focus:text-red-600"
            >
              <UserX className="w-4 h-4 mr-2" />
              Hủy theo dõi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : followStatus === "PENDING" ? (
        // Case 2: Đã gửi yêu cầu
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer gap-2 rounded-full bg-gray-100/50 hover:bg-gray-200/70 text-amber-600 transition px-4 py-2 h-10 shadow-sm"
              disabled={isLoading}
            >
              <Clock className="w-4 h-4" />
              Đã gửi yêu cầu
              <ChevronDown className="w-4 h-4" />
              {isLoading && <span className="ml-1 animate-pulse">...</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-lg shadow-lg border border-gray-100"
          >
            <DropdownMenuItem
              onClick={handleUnfollow}
              className="cursor-pointer flex items-center cursor-pointer text-red-600 focus:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy yêu cầu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Case 3: Chưa theo dõi hoặc đã bị từ chối
        <Button
          variant="ghost"
          className="cursor-pointer gap-2 rounded-full bg-gray-100/50 hover:bg-gray-200/70 text-blue-600 transition px-4 py-2 h-10 shadow-sm"
          onClick={handleFollow}
          disabled={isLoading}
        >
          <UserPlus className="w-4 h-4" />
          Theo dõi
          {isLoading && <span className="ml-1 animate-pulse">...</span>}
        </Button>
      )}

      <Button
        variant="ghost"
        className="cursor-pointer gap-2 rounded-full bg-gray-100/50 hover:bg-gray-200/70 text-gray-700 transition px-4 py-2 h-10 shadow-sm"
        onClick={onMessage}
      >
        <MessageCircle className="w-4 h-4" />
        Nhắn tin
      </Button>
    </div>
  );
}
