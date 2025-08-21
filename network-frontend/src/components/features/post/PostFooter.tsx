import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { cn } from "@/lib/utils/cn";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface PostFooterProps {
  content: string;
  author: {
    id: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
  className?: string;
  isDeleting?: boolean; // Thêm prop mới
}

export function PostFooter({
  content,
  author,
  createdAt,
  className,
  isDeleting = false, // Default value
}: PostFooterProps) {
  const fullName = author.user
    ? `${author.user.firstName} ${author.user.lastName}`
    : "Người dùng ẩn danh";
  const formattedDate = dayjs(createdAt).fromNow();

  return (
    <div
      className={cn(
        "px-4 pb-3 space-y-2",
        className,
        isDeleting && "opacity-50" // Làm mờ toàn bộ footer khi đang xóa
      )}
    >
      {/* Content with author name */}
      <div className="text-sm leading-snug">
        <span
          className={cn(
            "font-semibold mr-1.5",
            isDeleting && "opacity-70" // Làm mờ tên tác giả
          )}
        >
          {fullName}
        </span>
        <span
          className={cn(
            "text-gray-900",
            isDeleting && "opacity-70" // Làm mờ nội dung
          )}
        >
          {content}
        </span>
      </div>

      {/* Timestamp */}
      <p
        className={cn(
          "text-xs text-gray-400",
          isDeleting && "opacity-50" // Làm mờ thời gian
        )}
      >
        {formattedDate}
      </p>
    </div>
  );
}
