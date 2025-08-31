import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { GenderStat, AgeGroupStat } from "@/types/statistics";

interface DistributionCardProps {
  title: string;
  data: GenderStat[] | AgeGroupStat[];
  type: "gender" | "age";
  loading?: boolean;
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export const DistributionCard = ({
  title,
  data,
  type,
  loading,
}: DistributionCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Filter out items with count "0" or 0
  const filteredData = data.filter((item) => {
    const count =
      typeof item.count === "string" ? parseInt(item.count) : item.count;
    return count > 0;
  });

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = filteredData.map((item) => {
    const value =
      typeof item.count === "string" ? parseInt(item.count) : item.count;

    if (type === "gender") {
      return {
        name: (item as GenderStat).gender,
        value,
      };
    } else {
      return {
        name: (item as AgeGroupStat).ageGroup,
        value,
      };
    }
  });

  // Format tooltip
  const formatTooltip = (value: number, name: string) => {
    return [`${value} posts`, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value, percent }) =>
                `${name}: ${value} (${(percent! * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Additional summary */}
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Total: {chartData.reduce((sum, item) => sum + item.value, 0)} posts
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
