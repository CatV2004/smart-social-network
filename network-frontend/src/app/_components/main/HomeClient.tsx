"use client";

import StoryList from "@/components/features/story/StoriesList";
import SuggestionsSidebar from "@/components/features/suggestion/SuggestionsSidebar";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { PostContainer } from "@/components/features/post/PostContainer";
import { mockStories } from "@/lib/mock-data";
import { Suspense, useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function HomeClient() {
  const { recommendations, loading, syncLoading, error, getRecommendations } =
    useRecommendations();

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  // Tính toán trạng thái loading tổng hợp
  const isLoading = loading || syncLoading;

  return (
    <div className="flex justify-center gap-28 py-6 min-h-screen">
      {/* Main content */}
      <div className="w-full max-w-[650px]">
        <Suspense fallback={<LoadingSkeleton type="stories" />}>
          <StoryList stories={mockStories} />
        </Suspense>

        <PostContainer />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-[350px] flex-shrink-0">
        <Suspense fallback={<LoadingSkeleton type="suggestions" />}>
          <SuggestionsSidebar
            recommendations={recommendations}
            loading={isLoading}
            error={error}
            onRetry={getRecommendations}
          />
        </Suspense>
      </div>
    </div>
  );
}
