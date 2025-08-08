import StoryList from "@/components/features/story/StoriesList";
import PostList from "@/components/features/post/PostList";
import { mockStories, mockPosts, mockSuggestions } from "@/lib/mock-data";
import SuggestionsSidebar from "@/components/features/suggestion/SuggestionsSidebar";
// Đây là một Server Component, nó sẽ fetch dữ liệu và truyền xuống client
export default async function HomePage() {
  // Trong thực tế, bạn sẽ gọi service/API để lấy dữ liệu ở đây
  // const stories = await getStories();
  // const posts = await getPosts();

  return (
    <div className="flex justify-center gap-6 py-6">
      <div className="w-full max-w-[760px]">
        <StoryList stories={mockStories} />
        <PostList posts={mockPosts} />
      </div>
      {/* Right Sidebar */}
      <div className="hidden lg:block w-[330px]">
        <div className="fixed top-6 right-40 w-[330px]">
          <SuggestionsSidebar suggestions={mockSuggestions} />
        </div>
      </div>
    </div>
  );
}
