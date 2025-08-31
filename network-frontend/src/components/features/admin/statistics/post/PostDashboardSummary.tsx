"use client";

import { usePostStatistics } from "@/hooks/statistics/usePostStatistics";
import { PostOverviewCard } from "./cards/PostOverviewCard";
import { PostGrowthCard } from "./cards/PostGrowthCard";
import { DistributionCard } from "./cards/DistributionCard";
import { TopPostsCard } from "./cards/TopPostsCard";

export const PostDashboardSummary = () => {
  const {
    overview,
    postsByDay,
    topLiked,
    topCommented,
    mostSaved,
    byGender,
    byAgeGroup,
    loading,
    error,
  } = usePostStatistics();

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading post statistics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Post Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {overview && <PostOverviewCard overview={overview} loading={loading} />}

        <PostGrowthCard data={postsByDay} loading={loading} />

        <TopPostsCard
          title="Trending Posts"
          data={topLiked}
          metric="likes"
          loading={loading}
        />

        <DistributionCard
          title="Posts by Gender"
          data={byGender}
          type="gender"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistributionCard
          title="Posts by Age Group"
          data={byAgeGroup}
          type="age"
          loading={loading}
        />

        <TopPostsCard
          title="Most Engaging"
          data={topCommented}
          metric="comments"
          loading={loading}
        />
      </div>
    </div>
  );
};
