import { MapPinIcon, PhoneIcon, Cake, GenderIcon } from "@/components/ui/Icons";
import { Profile } from "@/types/profile";
import { formatDate, getGenderText } from "./utils";

interface ProfilePersonalInfoProps {
  profile: Profile;
}

export function ProfilePersonalInfo({ profile }: ProfilePersonalInfoProps) {
  const hasInfo =
    profile.location ||
    profile.phoneNumber ||
    profile.dateOfBirth ||
    profile.gender;

  if (!hasInfo) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
      {profile.location && (
        <div className="flex items-center gap-3 text-gray-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <MapPinIcon className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-sm">{profile.location}</span>
        </div>
      )}

      {profile.phoneNumber && (
        <div className="flex items-center gap-3 text-gray-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <PhoneIcon className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-sm">{profile.phoneNumber}</span>
        </div>
      )}

      {profile.dateOfBirth && (
        <div className="flex items-center gap-3 text-gray-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Cake className="w-4 h-4 text-pink-500" />
          </div>
          <span className="text-sm">
            Sinh nhật: {formatDate(profile.dateOfBirth)}
          </span>
        </div>
      )}

      {profile.gender && (
        <div className="flex items-center gap-3 text-gray-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <GenderIcon className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-sm">{getGenderText(profile.gender)}</span>
        </div>
      )}
    </div>
  );
}
