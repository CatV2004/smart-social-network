// src/components/features/admin/statistics/follow/FollowStatisticsDashboard.tsx
import React from "react";
import { useFollowStatistics } from "@/hooks/statistics/useFollowStatistics";
import TopFollowersCard from "./cards/TopFollowersCard";
import TopFollowingCard from "./cards/TopFollowingCard";
import MutualRateCard from "./cards/MutualRateCard";
import StatusDistributionCard from "./cards/StatusDistributionCard";
import GrowthChartCard from "./cards/GrowthChartCard";
import RejectedRateCard from "./cards/RejectedRateCard";
import StatsSkeleton from "./skeletons/StatsSkeleton";

interface FollowStatisticsDashboardProps {
  embedded?: boolean;
}

const FollowStatisticsDashboard: React.FC<FollowStatisticsDashboardProps> = ({
  embedded = false,
}) => {
  const {
    topFollowers,
    topFollowing,
    growth,
    mutualRate,
    statusDistribution,
    rejectedRate,
    loading,
    error,
    refetch,
  } = useFollowStatistics({
    enabled: true,
    refetchInterval: 30000,
  });

  if (loading) {
    return <StatsSkeleton embedded={embedded} />;
  }

  if (error) {
    return (
      <div className={`${embedded ? "" : "min-h-screen bg-gray-50 p-6"}`}>
        <div className={`${embedded ? "" : "max-w-7xl mx-auto"}`}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-2xl mb-3">⚠️</div>
            <h2 className="text-red-800 font-semibold text-lg mb-2">
              Error loading data
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? "" : "min-h-screen bg-gray-50 p-6"}`}>
      <div className={`${embedded ? "" : "max-w-7xl mx-auto"}`}>
        {!embedded && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Follow Statistics
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor and analyze follow activity
                </p>
              </div>
              <button
                onClick={refetch}
                className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Mutual Rate Card */}
          <MutualRateCard data={mutualRate} />

          {/* Rejected Rate Card */}
          <RejectedRateCard data={rejectedRate} />

          {/* Top Followers Card */}
          <TopFollowersCard data={topFollowers} />

          {/* Top Following Card */}
          <TopFollowingCard data={topFollowing} />

          {/* Status Distribution Card */}
          <StatusDistributionCard data={statusDistribution} />

          {/* Growth Chart Card */}
          <GrowthChartCard data={growth} />
        </div>

        {!embedded && (
          /* Summary Section */
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {topFollowers?.reduce(
                    (sum, follower) => sum + parseInt(follower.followers_count),
                    0
                  )}
                </div>
                <p className="text-sm text-gray-600">Total followers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {topFollowing?.reduce(
                    (sum, following) =>
                      sum + parseInt(following.following_count),
                    0
                  )}
                </div>
                <p className="text-sm text-gray-600">Total following</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {mutualRate?.mutualFollows || 0}
                </div>
                <p className="text-sm text-gray-600">Mutual follows</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {rejectedRate?.rejected || 0}
                </div>
                <p className="text-sm text-gray-600">Rejected follows</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowStatisticsDashboard;
