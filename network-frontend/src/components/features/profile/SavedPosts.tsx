import { MediaItem } from '@/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartIcon, BookmarkIcon } from '@/components/ui/Icons';

interface SavedPostsProps {
  posts: {
    id: string;
    media: MediaItem[];
    likesCount: number;
    isSaved: boolean;
  }[];
}

export const SavedPosts = ({ posts }: SavedPostsProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-6">
      {posts.map((post) => (
        <motion.div 
          key={post.id}
          whileHover={{ scale: 1.02 }}
          className="relative group aspect-square overflow-hidden bg-gray-100"
        >
          <Link href={`/p/${post.id}`} className="block h-full w-full">
            {post.media[0]?.type === 'IMAGE' ? (
              <Image
                src={post.media[0].url}
                alt="Saved post"
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={post.media[0].url}
                className="w-full h-full object-cover"
                muted
                loop
              />
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-6 text-white font-semibold">
                <div className="flex items-center gap-1">
                  <HeartIcon className="w-5 h-5" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookmarkIcon className="w-5 h-5 fill-white" />
                  <span>Đã lưu</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};