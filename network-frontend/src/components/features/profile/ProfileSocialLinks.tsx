import {
  LinkIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
} from "@/components/ui/Icons";
import { Profile } from "@/types/profile";
import { formatWebsite } from "./utils";

interface ProfileSocialLinksProps {
  profile: Profile;
}

export function ProfileSocialLinks({ profile }: ProfileSocialLinksProps) {
  const hasSocialInfo =
    profile.website || profile.facebook || profile.linkedin || profile.github;

  if (!hasSocialInfo) return null;

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Liên kết</h3>
      <div className="flex flex-wrap gap-3">
        {profile.website && (
          <a
            href={
              profile.website.startsWith("http")
                ? profile.website
                : `https://${profile.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="text-sm">{formatWebsite(profile.website)}</span>
          </a>
        )}

        {profile.facebook && (
          <a
            href={profile.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
          >
            <FacebookIcon className="w-4 h-4" />
            <span className="text-sm">Facebook</span>
          </a>
        )}

        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-700 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
          >
            <LinkedinIcon className="w-4 h-4" />
            <span className="text-sm">LinkedIn</span>
          </a>
        )}

        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-gray-900 transition-all shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="text-sm">GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
}
