import React from "react";
import { FollowGrowthStat } from "@/types/statistics";

interface GrowthChartCardProps {
  data: FollowGrowthStat[] | undefined;
}

const GrowthChartCard: React.FC<GrowthChartCardProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Follow Growth
        </h3>
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((item) => parseInt(item.count)));
  const total = data.reduce((sum, item) => sum + parseInt(item.count), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Follow Growth
      </h3>

      <div className="space-y-2 mb-4">
        {data.map((item, index) => {
          const percentage =
            maxCount > 0 ? (parseInt(item.count) / maxCount) * 100 : 0;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-sm text-gray-600 truncate">
                {item.period}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-8 text-right text-sm font-semibold text-gray-900">
                {item.count}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">Total: {total} follows</span>
        <span className="text-sm text-gray-600">{data.length} periods</span>
      </div>
    </div>
  );
};

export default GrowthChartCard;
