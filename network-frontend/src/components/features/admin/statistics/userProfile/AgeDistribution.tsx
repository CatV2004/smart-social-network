import { useAgeStats } from "@/hooks/statistics/useUserProfileStatistics";
import React from "react";

export const AgeDistribution: React.FC = () => {
  const { data, loading, error } = useAgeStats();

  if (loading)
    return <div className="animate-pulse">Loading age distribution...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const total = data.reduce((sum, item) => sum + parseInt(item.count), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = ((parseInt(item.count) / total) * 100).toFixed(1);
          return (
            <div key={item.ageGroup} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.ageGroup}</span>
                <span>
                  {item.count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
