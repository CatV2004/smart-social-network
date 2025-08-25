"use client";

import { useState, useEffect } from "react";
import { TrashPostContainer } from "@/components/features/post/TrashPostContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function TrashClient() {
  const [loading, setLoading] = useState(true);

  // Giả lập loading để show skeleton ngay khi mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200); // 200ms hoặc theo fetch thực tế
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-3 min-h-screen">
      <Card className="border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
          <div>
            <CardTitle className="text-xl font-bold">
              Bài viết đã xóa gần đây
            </CardTitle>
            <p className="text-sm text-gray-500">
              Những bài viết bạn đã xóa sẽ hiển thị tại đây trong 30 ngày trước
              khi bị xóa vĩnh viễn.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {loading ? (
            // Skeleton reserve đủ height cho list bài viết
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <LoadingSkeleton key={i} type="posts" count={1} />
              ))}
            </div>
          ) : (
            <TrashPostContainer />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
