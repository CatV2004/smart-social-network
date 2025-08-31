import React from "react";
import { TopFollowing } from "@/types/statistics";

interface TopFollowingCardProps {
  data: TopFollowing[] | undefined;
}

const TopFollowingCard: React.FC<TopFollowingCardProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Following
        </h3>
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Following</h3>
        <span className="text-sm text-gray-500">{data.length} users</span>
      </div>
      <div className="space-y-3">
        {data.map((following, index) => (
          <div
            key={following.profileId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <img
                src={following.avatar}
                alt={following.fullname}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40";
                }}
              />
              <div>
                <p className="font-medium text-gray-900">
                  {following.fullname}
                </p>
                <p className="text-sm text-gray-500">@{following.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">
                {following.following_count}
              </p>
              <p className="text-xs text-gray-500">following</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFollowingCard;
