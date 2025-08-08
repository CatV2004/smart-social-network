import Image from 'next/image';
import { type Story } from '@/lib/mock-data';

export default function StoryCircle({ story }: { story: Story }) {
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer">
      <div className="bg-gradient-to-tr from-sky-400 via-purple-500 to-pink-500 p-[2px] rounded-full">
        <div className="bg-white p-[2px] rounded-full">
          <Image
            src={story.avatarUrl}
            alt={story.username}
            width={75}
            height={75}
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-800 text-center truncate w-24">
        {story.username}
      </p>
    </div>
  );
}
