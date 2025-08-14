import ProfileClient from "@/components/features/profile/ProfileClient";

interface ProfilePageProps {
  params: { userId: string };
}
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  return <ProfileClient userId={userId} />;
}
