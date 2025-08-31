import React from "react";
import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mail,
  User,
  MapPin,
  Link,
  Phone,
  Cake,
  Users,
  Edit,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { UserStatus } from "@/types/user";

interface UserProfilePanelProps {
  user: Profile;
  onClose: () => void;
  onEdit: () => void;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  user,
  onClose,
  onEdit,
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={user.avatar!} alt={user.user.username} />
          <AvatarFallback className="text-lg font-medium">
            {getInitials(user.user.firstName, user.user.lastName)}
          </AvatarFallback>
        </Avatar>

        <h3 className="text-xl font-semibold">
          {user.user.firstName} {user.user.lastName}
        </h3>
        <p className="text-muted-foreground">@{user.user.username}</p>

        <div className="flex gap-2 mt-3">
          <Badge
            variant={user.user.role === "ADMIN" ? "default" : "secondary"}
            className={
              user.user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : ""
            }
          >
            <Shield className="h-3 w-3 mr-1" />
            {user.user.role}
          </Badge>
          <Badge
            variant={user.user.status !== UserStatus.ACTIVE ? "destructive" : "default"}
          >
            {user.user.status !== UserStatus.ACTIVE ? (
              <Ban className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {user.user.status === UserStatus.BANNED ? "Banned" : "Active"}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={onEdit} className="flex-1" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" size="icon" onClick={onClose}>
          <User className="h-4 w-4" />
        </Button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">
          CONTACT INFORMATION
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Joined</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(user.user.createdAt, "long")}
              </p>
            </div>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {user.phoneNumber}
                </p>
              </div>
            </div>
          )}

          {user.dateOfBirth && (
            <div className="flex items-center gap-3">
              <Cake className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Birthdate</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.dateOfBirth, "short")}
                </p>
              </div>
            </div>
          )}

          {user.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{user.location}</p>
              </div>
            </div>
          )}

          {user.website && (
            <div className="flex items-center gap-3">
              <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Website</p>
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  {user.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-xl font-bold">{user.followersCount}</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{user.followingCount}</div>
          <div className="text-xs text-muted-foreground">Following</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">
            BIO
          </h4>
          <p className="text-sm">{user.bio}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfilePanel;
