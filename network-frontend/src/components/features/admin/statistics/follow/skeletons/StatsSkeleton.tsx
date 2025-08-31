// src/components/features/admin/statistics/follow/skeletons/StatsSkeleton.tsx
import React from "react";

interface StatsSkeletonProps {
  embedded?: boolean;
}

const StatsSkeleton: React.FC<StatsSkeletonProps> = ({ embedded = false }) => {
  return (
    <div className={`${embedded ? "" : "min-h-screen bg-gray-50 p-6"}`}>
      <div className={`${embedded ? "" : "max-w-7xl mx-auto"}`}>
        {!embedded && (
          <>
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </>
        )}

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
              <div className="h-3 bg-gray-200 rounded-full mb-2"></div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {!embedded && (
          /* Summary Skeleton */
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSkeleton;
