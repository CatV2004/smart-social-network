interface ProfileBioProps {
  bio: string | null;
}

export function ProfileBio({ bio }: ProfileBioProps) {
  if (!bio) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
      <p className="text-sm text-gray-800 whitespace-pre-line">{bio}</p>
    </div>
  );
}
