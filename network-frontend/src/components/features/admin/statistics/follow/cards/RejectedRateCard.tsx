import React from "react";
import { RejectedRateStat } from "@/types/statistics";

interface RejectedRateCardProps {
  data: RejectedRateStat | undefined | null;
}

const RejectedRateCard: React.FC<RejectedRateCardProps> = ({ data }) => {
  const rate = data ? data.rate * 100 : 0;
  const rejected = data?.rejected || 0;
  const total = data?.total || 0;

  const getRateColor = (rate: number) => {
    if (rate === 0) return "text-green-600";
    if (rate <= 10) return "text-yellow-600";
    if (rate <= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getRateLevel = (rate: number) => {
    if (rate === 0) return "Excellent";
    if (rate <= 10) return "Good";
    if (rate <= 30) return "Average";
    return "High";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rejection Rate
      </h3>

      <div className="text-center mb-4">
        <div className={`text-4xl font-bold ${getRateColor(rate)} mb-2`}>
          {rate.toFixed(1)}%
        </div>
        <p className="text-sm text-gray-600">{getRateLevel(rate)}</p>
      </div>

      <div className="bg-gray-100 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-red-400 to-orange-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="font-semibold text-red-600">{rejected}</div>
          <div className="text-gray-600">Rejected</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-600">{total}</div>
          <div className="text-gray-600">Total requests</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {rejected} of {total} requests were rejected
      </div>
    </div>
  );
};

export default RejectedRateCard;
