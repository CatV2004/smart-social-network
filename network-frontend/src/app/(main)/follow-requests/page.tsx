import FollowRequestsList from "@/components/features/follow/FollowRequestsList";

export default function FollowRequestsPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <FollowRequestsList />
        </div>
      </div>
    </div>
  );
}
