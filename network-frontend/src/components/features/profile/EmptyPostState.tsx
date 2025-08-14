import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/ui/Icons";
import Link from "next/link";

export const EmptyPostState = ({ isCurrentUser = false }: { isCurrentUser?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <CameraIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">
        {isCurrentUser ? "Chia sẻ ảnh đầu tiên của bạn" : "Chưa có bài viết nào"}
      </h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {isCurrentUser 
          ? "Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn." 
          : "Người dùng này chưa đăng bất kỳ bài viết nào."}
      </p>
      
      {isCurrentUser && (
        <Button asChild>
          <Link href="/create">
            Chia sẻ ảnh đầu tiên
          </Link>
        </Button>
      )}
    </div>
  );
};