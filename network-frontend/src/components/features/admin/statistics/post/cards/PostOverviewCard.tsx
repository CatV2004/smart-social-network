import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostOverview } from "@/types/statistics";
import { FileText, Trash2 } from "lucide-react";

interface PostOverviewCardProps {
  overview: PostOverview;
  loading?: boolean;
}

export const PostOverviewCard = ({
  overview,
  loading,
}: PostOverviewCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <p className="text-xs text-muted-foreground mt-2 h-4 bg-gray-200 rounded animate-pulse"></p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {overview.totalPosts.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          {overview.totalDeleted} deleted posts
        </p>
      </CardContent>
    </Card>
  );
};
