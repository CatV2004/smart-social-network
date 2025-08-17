import ProfileClient from "@/components/features/profile/ProfileClient";

interface ProfilePageProps {
  params: { username: string };
}
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  return <ProfileClient username={username} />;
}
