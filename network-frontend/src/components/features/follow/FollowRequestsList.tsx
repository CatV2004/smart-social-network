"use client";

import { useFollowRequests } from "@/hooks/useFollowRequests";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircleIcon } from "@/components/ui/Icons";
import { Icons } from "@/lib/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils/cn";

export default function FollowRequestsList() {
  const {
    requests,
    meta,
    loading,
    error,
    loadRequests,
    loadMore,
    acceptRequest,
    rejectRequest,
  } = useFollowRequests();

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadRequests(1, 10);
  }, [loadRequests]);

  // Infinite scroll implementation
  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && meta && meta.page < meta.totalPages) {
          setIsLoadingMore(true);
          loadMore().finally(() => setIsLoadingMore(false));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isLoadingMore, meta, loadMore]
  );

  const handleAccept = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));

    // Thêm hiệu ứng mờ dần trước khi xóa
    setRemovingIds((prev) => new Set(prev).add(id));

    // Đợi một chút để hiệu ứng hoàn thành
    await new Promise((resolve) => setTimeout(resolve, 300));

    await acceptRequest(id);

    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    setRemovingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleReject = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));

    // Thêm hiệu ứng mờ dần trước khi xóa
    setRemovingIds((prev) => new Set(prev).add(id));

    // Đợi một chút để hiệu ứng hoàn thành
    await new Promise((resolve) => setTimeout(resolve, 300));

    await rejectRequest(id);

    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    setRemovingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Tải lại dữ liệu
  const reload = () => {
    loadRequests(1, 10);
  };

  if (loading && requests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        <LoadingSkeleton type="follow-requests" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircleIcon className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Something went wrong</h3>
                <p className="text-muted-foreground mt-2">{error}</p>
              </div>
              <Button onClick={reload} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-muted p-4">
                <FontAwesomeIcon
                  icon={Icons.userPlus}
                  className="h-8 w-8 text-muted-foreground"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No follow requests</h3>
                <p className="text-muted-foreground mt-2">
                  When someone requests to follow you, it will appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Follow Requests</h1>
        <Badge variant="secondary" className="px-3 py-1">
          {meta?.totalPages || requests.length} requests
        </Badge>
      </div>

      <div className="space-y-4">
        {requests.map((req, index) => {
          const isProcessing = processingIds.has(req.id);
          const isRemoving = removingIds.has(req.id);

          // Gán ref cho phần tử cuối cùng để theo dõi
          const ref = index === requests.length - 1 ? lastItemRef : null;

          return (
            <Card
              key={req.id}
              ref={ref}
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-md",
                isRemoving && "opacity-0 transform scale-95 -translate-y-2"
              )}
              style={{
                transitionProperty: "transform, opacity",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={req.profile.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10">
                        {req.profile.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      {/* Tên và username */}
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">
                          {req.profile.user.firstName}{" "}
                          {req.profile.user.lastName}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">
                          ({req.profile.user.username})
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {req.profile.bio || "No bio available"}
                      </p>

                      {/* Ngày request */}
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested{" "}
                        {new Date(req.followedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAccept(req.id)}
                      disabled={isProcessing || isRemoving}
                      className="min-w-20 transition-colors"
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="sm" className="mr-1" />
                      ) : (
                        <FontAwesomeIcon
                          icon={Icons.check}
                          className="h-4 w-4 mr-1"
                        />
                      )}
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(req.id)}
                      disabled={isProcessing || isRemoving}
                      className="min-w-20 transition-colors"
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="sm" className="mr-1" />
                      ) : (
                        <FontAwesomeIcon
                          icon={Icons.x}
                          className="h-4 w-4 mr-1"
                        />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hiển thị loading khi đang tải thêm */}
      {isLoadingMore && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner size="md" />
        </div>
      )}

      {/* Thêm một phần tử ẩn để kích hoạt infinite scroll nếu không có đủ items */}
      {meta && meta.page < meta.totalPages && !isLoadingMore && (
        <div ref={lastItemRef} className="h-1 w-full" />
      )}
    </div>
  );
}
