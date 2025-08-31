import React from "react";
import { MutualRateStat } from "@/types/statistics";

interface MutualRateCardProps {
  data: MutualRateStat | undefined | null;
}

const MutualRateCard: React.FC<MutualRateCardProps> = ({ data }) => {
  const rate = data ? data.rate * 100 : 0;
  const mutualFollows = data?.mutualFollows || 0;
  const totalFollows = data?.totalFollows || 0;

  const getRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getRateLevel = (rate: number) => {
    if (rate >= 70) return "High";
    if (rate >= 40) return "Medium";
    return "Low";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Mutual Follows Rate
      </h3>

      <div className="text-center mb-4">
        <div className={`text-4xl font-bold ${getRateColor(rate)} mb-2`}>
          {rate.toFixed(1)}%
        </div>
        <p className="text-sm text-gray-600">{getRateLevel(rate)}</p>
      </div>

      <div className="bg-gray-100 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="font-semibold text-blue-600">{mutualFollows}</div>
          <div className="text-gray-600">Mutual</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-600">{totalFollows}</div>
          <div className="text-gray-600">Total Follows</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {mutualFollows} of {totalFollows} follows are mutual
      </div>
    </div>
  );
};

export default MutualRateCard;
