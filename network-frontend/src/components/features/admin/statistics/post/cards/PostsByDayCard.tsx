import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostByDay } from "@/types/statistics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PostsByDayCardProps {
  data: PostByDay[];
  loading?: boolean;
}

export const PostsByDayCard = ({ data, loading }: PostsByDayCardProps) => {
  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Posts by Day</CardTitle>
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

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Posts by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="posts" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
