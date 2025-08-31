"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  AlertTriangle,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";
import { useFollowStatistics } from "@/hooks/statistics/useFollowStatistics";
import { usePostStatistics } from "@/hooks/statistics/usePostStatistics";
import { FollowStatisticsDashboard } from "@/components/features/admin/statistics/follow";
import { PostDashboardSummary } from "@/components/features/admin/statistics/post/PostDashboardSummary";
import { PostStatisticsDashboard } from "@/components/features/admin/statistics/post/PostStatisticsDashboard";
import { UserProfileStatisticsDashboard } from "@/components/features/admin/statistics/userProfile/UserProfileStatisticsDashboard";

export default function DashboardPage() {
  const {
    mutualRate,
    rejectedRate,
    topFollowers,
    topFollowing,
    loading: followLoading,
  } = useFollowStatistics({
    enabled: true,
    refetchInterval: 30000,
  });

  const { overview: postOverview, loading: postLoading } = usePostStatistics();

  const isLoading = followLoading || postLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">System Overview</p>
        </div>
      </div>

      {/* User Statistics Dashboard */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            User Statistics
          </h2>
          <p className="text-gray-500">
            Overall analysis of users in the system
          </p>
        </div>
        <div className="p-6">
          <UserProfileStatisticsDashboard />
        </div>
      </div>

      {/* Cards thống kê Follows */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Mutual Rate Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Mutual Follows
            </CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            {followLoading ? (
              <>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {mutualRate ? `${(mutualRate.rate * 100).toFixed(1)}%` : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mutualRate
                    ? `${mutualRate.mutualFollows} mutual`
                    : "No data"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Rejected Rate Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <UserX className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            {followLoading ? (
              <>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {rejectedRate
                    ? `${(rejectedRate.rate * 100).toFixed(1)}%`
                    : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {rejectedRate
                    ? `${rejectedRate.rejected} rejected`
                    : "No data"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top Followers Summary */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Followers</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {followLoading ? (
              <>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {topFollowers?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {topFollowers
                    ? `${topFollowers.reduce(
                        (sum, f) => sum + parseInt(f.followers_count),
                        0
                      )} total`
                    : "No data"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top Following Summary */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Following</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            {followLoading ? (
              <>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {topFollowing?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {topFollowing
                    ? `${topFollowing.reduce(
                        (sum, f) => sum + parseInt(f.following_count),
                        0
                      )} total`
                    : "No data"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard thống kê chi tiết */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Detailed Follow Statistics
          </h2>
          <p className="text-gray-500">
            Detailed analysis of follow activities in the system
          </p>
        </div>
        <div className="p-6">
          <FollowStatisticsDashboard />
        </div>
      </div>

      {/* Post Analytics Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Overall Post Statistics
          </h2>
          <p className="text-gray-500">
            Overall analysis of post activities in the system
          </p>
        </div>
        <div className="p-6">
          <PostDashboardSummary />
        </div>
      </div>

      {/* Post Statistics Dashboard (Full) */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Detailed Post Statistics
          </h2>
          <p className="text-gray-500">
            Comprehensive detailed analysis of posts in the system
          </p>
        </div>
        <div className="p-6">
          <PostStatisticsDashboard />
        </div>
      </div>

      {/* Các section khác */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              The activity log table will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Overview Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              The summary statistics chart will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
