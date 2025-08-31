import React from "react";
import { FollowStatusDistribution } from "@/types/statistics";

interface StatusDistributionCardProps {
  data: FollowStatusDistribution[] | undefined;
}

const StatusDistributionCard: React.FC<StatusDistributionCardProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Status Distribution
        </h3>
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Status Distribution
      </h3>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 ${getStatusColor(
                  item.status
                )} rounded-full`}
              />
              <span className="text-sm font-medium text-gray-700">
                {getStatusText(item.status)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {item.count}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({(item.percentage * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusDistributionCard;
