"use client";

import { usePostStatistics } from "@/hooks/statistics/usePostStatistics";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { OverviewCard } from "./cards/OverviewCard";
import { PostsByDayCard } from "./cards/PostsByDayCard";
import { TopPostsCard } from "./cards/TopPostsCard";
import { DistributionCard } from "./cards/DistributionCard";

export const PostStatisticsDashboard = () => {
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
    refetchAll,
  } = usePostStatistics();

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={refetchAll} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Post Statistics</h1>
        <Button
          onClick={refetchAll}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {overview && <OverviewCard overview={overview} loading={loading} />}

        <PostsByDayCard data={postsByDay} loading={loading} />

        <TopPostsCard
          title="Top Liked Posts"
          data={topLiked}
          metric="likes"
          loading={loading}
        />

        <TopPostsCard
          title="Top Commented Posts"
          data={topCommented}
          metric="comments"
          loading={loading}
        />

        <TopPostsCard
          title="Most Saved Posts"
          data={mostSaved}
          metric="saves"
          loading={loading}
        />

        <DistributionCard
          title="Posts by Gender"
          data={byGender}
          type="gender"
          loading={loading}
        />

        <DistributionCard
          title="Posts by Age Group"
          data={byAgeGroup}
          type="age"
          loading={loading}
        />
      </div>
    </div>
  );
};
