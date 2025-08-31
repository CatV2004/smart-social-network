import { useGenderStats } from "@/hooks/statistics/useUserProfileStatistics";
import React from "react";

export const GenderDistribution: React.FC = () => {
  const { data, loading, error } = useGenderStats();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + parseInt(item.count), 0);

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-500";
      case "FEMALE":
        return "bg-pink-500";
      case "OTHER":
        return "bg-purple-500";
      case "PREFER_NOT_TO_SAY":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "OTHER":
        return "Other";
      case "PREFER_NOT_TO_SAY":
        return "Prefer not to say";
      default:
        return gender;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const count = parseInt(item.count);
          const percentage =
            total > 0 ? ((count / total) * 100).toFixed(1) : "0";

          return (
            <div key={item.gender} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {getGenderLabel(item.gender)}
                </span>
                <span className="text-gray-600">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getGenderColor(
                    item.gender
                  )} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Total</span>
            <span className="text-gray-900">{total} users</span>
          </div>
        </div>
      )}
    </div>
  );
};
