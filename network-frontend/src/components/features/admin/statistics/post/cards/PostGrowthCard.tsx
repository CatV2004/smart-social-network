import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostByDay } from "@/types/statistics";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PostGrowthCardProps {
  data: PostByDay[];
  loading?: boolean;
}

export const PostGrowthCard = ({ data, loading }: PostGrowthCardProps) => {
  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Post Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    posts: parseInt(item.count),
  }));

  const totalThisWeek = chartData.reduce((sum, item) => sum + item.posts, 0);
  const lastWeekTotal =
    totalThisWeek > 7 ? totalThisWeek - chartData[0]?.posts : 0;
  const growthRate =
    lastWeekTotal > 0
      ? ((totalThisWeek - lastWeekTotal) / lastWeekTotal) * 100
      : 0;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Post Growth</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalThisWeek}</div>
        <p className="text-xs text-muted-foreground">
          {growthRate >= 0 ? "+" : ""}
          {growthRate.toFixed(1)}% from last period
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
