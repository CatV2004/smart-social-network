import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Post } from "@/types/post";
import { useSelector } from "react-redux";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";

interface PostHeaderProps {
  post: Post;
  author: {
    id: string;
    avatar: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
    };
  };
  className?: string;
  optionsClassName?: string;
  onEdit?: () => void;
  onDelete?: (post: Post) => void;
  onReport?: (post: Post) => void;
  isDeleting?: boolean;
  hideOptions?: boolean;
}

export function PostHeader({
  post,
  author,
  className,
  optionsClassName,
  onEdit,
  onDelete,
  onReport,
  isDeleting = false,
  hideOptions = false,
}: PostHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentProfile = useSelector(selectMyProfile);
  const isCurrentUser =
    currentProfile?.user?.id && author.user?.id === currentProfile?.user.id;

  const fullName = author.user
    ? `${author.user.firstName} ${author.user.lastName}`
    : "Người dùng ẩn danh";

  const username = author.user ? `@${author.user.username}` : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.(post);
  };

  const handleReportClick = () => {
    setMenuOpen(false);
    onReport?.(post);
  };

  return (
    <div
      className={cn(
        "flex items-center w-full",
        className,
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <Link href={`/in/${author.user?.username}`} className="flex items-center">
        <Image
          src={author.avatar}
          alt={fullName}
          width={42}
          height={42}
          className="rounded-full object-cover aspect-square"
        />
        <div className="ml-3 flex flex-col">
          <p className="font-bold text-sm text-black tracking-tight">
            {fullName}
          </p>
          {username && <p className="text-xs text-gray-500">{username}</p>}
        </div>
      </Link>

      {/* Menu button */}
      {!hideOptions && (
        <div ref={menuRef} className="ml-auto relative">
          <button
            className={cn("p-2 rounded-full cursor-pointer", optionsClassName)}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
              <div className="py-1.5">
                {isCurrentUser ? (
                  <>
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 ease-out cursor-pointer"
                      onClick={handleEdit}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa bài viết
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 ease-out cursor-pointer"
                      onClick={handleDelete}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Xóa bài viết
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 ease-out cursor-pointer"
                    onClick={handleReportClick}
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                      />
                    </svg>
                    Báo cáo bài viết
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
