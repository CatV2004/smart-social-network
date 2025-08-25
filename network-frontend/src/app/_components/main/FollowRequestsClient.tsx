"use client";

import { useState, useEffect } from "react";
import FollowRequestsList from "@/components/features/follow/FollowRequestsList";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function FollowRequestsClient() {
  const [loading, setLoading] = useState(true);

  // Giả lập loading ban đầu hoặc dựa vào fetch thực tế bên FollowRequestsList
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200); // 200ms hoặc fetch thật
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-6 min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {loading ? (
            // Skeleton reserve height cho danh sách follow requests
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeleton key={i} type="follow-requests" count={1} />
              ))}
            </div>
          ) : (
            <FollowRequestsList />
          )}
        </div>
      </div>
    </div>
  );
}
