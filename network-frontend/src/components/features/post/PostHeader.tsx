import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";

interface PostHeaderProps {
  author: {
    id: string;
    avatar: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  className?: string;
  optionsClassName?: string;
}

export function PostHeader({
  author,
  className,
  optionsClassName,
}: PostHeaderProps) {
  const fullName = author.user
    ? `${author.user.firstName} ${author.user.lastName}`
    : "Người dùng ẩn danh";

  return (
    <div className={cn("flex items-center p-3 border-b", className)}>
      <Link href={`/in/${author.user?.id}`} className="flex items-center">
        <Image
          src={author.avatar}
          alt={fullName}
          width={32}
          height={32}
          className="rounded-full object-cover aspect-square"
        />
        <p className="font-semibold text-sm ml-3">{fullName}</p>
      </Link>
      <button className={cn("ml-auto text-xl font-bold", optionsClassName)}>
        ...
      </button>
    </div>
  );
}
