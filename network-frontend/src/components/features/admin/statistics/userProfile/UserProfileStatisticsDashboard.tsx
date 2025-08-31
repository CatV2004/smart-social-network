import React, { useState } from "react";
import { StatisticsCards } from "./StatisticsCards";
import { GenderDistribution } from "./GenderDistribution";
import { AgeDistribution } from "./AgeDistribution";
import { UserStatusChart } from "./UserStatusChart";
import { NewUsersStats } from "./NewUsersStats";
import { PeriodType } from "@/types/statistics";

export const UserProfileStatisticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("month");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Statistics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodType)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>

      <StatisticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GenderDistribution />
        <AgeDistribution />
        <UserStatusChart />
        <NewUsersStats />
      </div>
    </div>
  );
};
