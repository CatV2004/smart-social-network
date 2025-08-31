import {
  useTotalUsers,
  useVerificationStats,
} from "@/hooks/statistics/useUserProfileStatistics";
import React from "react";

export const StatisticsCards: React.FC = () => {
  const {
    data: totalUsers,
    loading: totalLoading,
    error: totalError,
  } = useTotalUsers();
  const {
    data: verification,
    loading: verificationLoading,
    error: verificationError,
  } = useVerificationStats();

  if (totalLoading || verificationLoading) {
    return <div className="animate-pulse">Loading statistics...</div>;
  }

  if (totalError || verificationError) {
    return <div className="text-red-500">Error loading statistics</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Users Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Verified Users Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <VerifiedIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">
              Verified Users
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {verification?.verified}/{verification?.total}
            </p>
            <p className="text-sm text-green-600">
              {verification?.percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Active Users Card - You can add more cards as needed */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <ActiveIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      {/* Pending Users Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <PendingIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-600">Pending Users</h3>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon components (you can replace with actual icons from your icon library)
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const PendingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
