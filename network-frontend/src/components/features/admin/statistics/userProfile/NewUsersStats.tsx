import React, { useState } from "react";
import { PeriodType } from "@/types/statistics";
import { useNewUsersStats } from "@/hooks/statistics/useUserProfileStatistics";

export const NewUsersStats: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("month");
  const { data, loading, error } = useNewUsersStats(period);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">New Users</h3>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">New Users</h3>
        <div className="text-red-500 text-center py-4">Error: {error}</div>
      </div>
    );
  }

  const formatPeriod = (period: string, type: PeriodType) => {
    if (type === "day") {
      return new Date(period).toLocaleDateString();
    }
    return period;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">New Users</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>

      <div className="space-y-3">
        {data.slice(0, 5).map((item) => (
          <div
            key={item.period}
            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
          >
            <span className="text-sm text-gray-600">
              {formatPeriod(item.period, period)}
            </span>
            <span className="font-medium text-gray-900">
              {item.count} users
            </span>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-6 text-gray-500">No data available</div>
      )}
    </div>
  );
};
