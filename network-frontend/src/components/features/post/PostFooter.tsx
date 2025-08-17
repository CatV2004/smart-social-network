import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { formatNumber } from "@/lib/format";
import clsx from "clsx";

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
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  className?: string; // 👈 thêm className
}

export function PostFooter({
  content,
  author,
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  className,
}: PostFooterProps) {
  const fullName = author.user
    ? `${author.user.firstName} ${author.user.lastName}`
    : "Người dùng ẩn danh";
  const formattedDate = dayjs(createdAt).fromNow();

  return (
    <div className={clsx("p-3", className)}>
      <p className="font-semibold text-sm">
        {formatNumber(likesCount)} lượt thích
      </p>
      <div className="text-sm mt-1">
        <span className="font-semibold">{fullName}</span> {content}
      </div>
      {commentsCount > 0 && (
        <p className="text-sm text-gray-500 mt-1 cursor-pointer">
          Xem tất cả {formatNumber(commentsCount)} bình luận
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
      <input
        type="text"
        placeholder="Thêm bình luận..."
        className="w-full text-sm outline-none bg-transparent mt-2 border-t pt-2"
      />
    </div>
  );
}
