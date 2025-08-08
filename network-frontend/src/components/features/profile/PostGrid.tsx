import { PostThumbnail } from '@/types/post';
import { HeartIcon, MessageSquareIcon } from 'lucide-react';
import Image from 'next/image';

interface PostGridProps {
  posts: PostThumbnail[];
  isCurrentUser?: boolean;
}

const PostGrid = ({ posts, isCurrentUser = false }: PostGridProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
          <svg aria-label="Máy ảnh" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <path d="M12 9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"></path>
            <path d="M16.5 2.5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 .5-.5Zm-2 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fillRule="evenodd"></path>
            <path d="M2 5.5a3.5 3.5 0 0 1 3.5-3.5h13A3.5 3.5 0 0 1 22 5.5v13a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 18.5v-13Zm3.5-1.5a1.5 1.5 0 0 0-1.5 1.5v13a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-13a1.5 1.5 0 0 0-1.5-1.5h-13Z" fillRule="evenodd"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mt-4">
          {isCurrentUser ? "Chưa có bài viết nào" : "Không có bài viết nào"}
        </h2>
        {isCurrentUser && (
          <p className="text-gray-500 mt-2">Bắt đầu chia sẻ ảnh và video của bạn</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <div key={post.id} className="relative aspect-square group">
          <Image
            src={post.imageUrl}
            alt={`Post by ${post.username}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-x-4 text-white font-bold transition-all duration-300">
            <span className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4" />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="w-4 h-4" />
              {post.commentsCount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;