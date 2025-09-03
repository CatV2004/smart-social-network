"use client";

import { Recommendation } from "@/types/recommentdation";
import { useAppDispatch } from "@/redux/hooks";
import { followUser } from "@/redux/features/profile/profileThunks";
import { removeRecommendation } from "@/redux/features/recomment/recommentdationThunks";
import { useState } from "react";

interface SuggestionsSidebarProps {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function SuggestionsSidebar({
  recommendations,
  loading,
  error,
  onRetry,
}: SuggestionsSidebarProps) {
  const dispatch = useAppDispatch();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const showLoading = loading || (recommendations.length === 0 && !error);

  const handleFollow = async (userId: string, recommendationId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(userId));

      await dispatch(followUser(userId)).unwrap();

      // Cập nhật Redux (xóa recommendation nếu muốn)
      await dispatch(removeRecommendation(recommendationId)).unwrap();
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (showLoading) {
    return (
      <div className="text-base text-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900 text-lg">Gợi ý cho bạn</h2>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-base text-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900 text-lg">Gợi ý cho bạn</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Đã có lỗi xảy ra</p>
          <button
            onClick={onRetry}
            className="text-blue-500 text-sm font-medium hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-base text-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900 text-lg">Gợi ý cho bạn</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Không có gợi ý nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-base text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">Gợi ý cho bạn</h2>
        <button className="text-blue-500 text-sm font-medium hover:underline">
          Xem tất cả
        </button>
      </div>

      <ul className="space-y-5">
        {recommendations.map((recommendation) => {
          const candidateId = recommendation.candidate?.id;
          const isFollowing =
            recommendation.isSendFollow || // từ API
            (candidateId ? processingIds.has(candidateId) : false);

          return (
            <li
              key={recommendation.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    recommendation.candidate?.avatar || "/avatar-default.svg"
                  }
                  alt={`${recommendation.candidate?.firstName || ""} ${
                    recommendation.candidate?.lastName || ""
                  }`}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-[15px]">
                    {recommendation.candidate?.firstName}{" "}
                    {recommendation.candidate?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {
                      recommendation.commonFeatures?.common_connections_info
                        ?.description
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  candidateId && handleFollow(candidateId, recommendation.id)
                }
                disabled={isFollowing}
                className={`text-sm font-semibold hover:underline ${
                  isFollowing
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-blue-500"
                }`}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
