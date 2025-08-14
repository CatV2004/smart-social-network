import StoryList from "@/components/features/story/StoriesList";
import PostList from "@/components/features/post/PostList";
import { mockStories, mockPosts, mockSuggestions } from "@/lib/mock-data";
import SuggestionsSidebar from "@/components/features/suggestion/SuggestionsSidebar";
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default async function HomePage() {
  return (
    <div className="flex justify-center gap-6 py-6">
      <div className="w-full max-w-[630px]">
        <Suspense fallback={<LoadingSkeleton type="stories" />}>
          <StoryList stories={mockStories} />
        </Suspense>
        
        <Suspense fallback={<LoadingSkeleton type="posts" count={3} />}>
          <PostList posts={mockPosts} />
        </Suspense>
      </div>
      
      {/* Right Sidebar */}
      <div className="hidden lg:block w-[350px]">
        <div className="w-[350px]">
          <Suspense fallback={<LoadingSkeleton type="suggestions" />}>
            <SuggestionsSidebar suggestions={mockSuggestions} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}