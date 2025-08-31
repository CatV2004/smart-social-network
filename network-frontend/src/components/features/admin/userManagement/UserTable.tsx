import React from "react";
import { Profile } from "@/types/profile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  User,
  Calendar,
  Ban,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils/format";
import { UserStatus } from "@/types/user";

interface UserTableProps {
  users: Profile[];
  onEdit: (user: Profile) => void;
  onView: (user: Profile) => void;
  onBan?: (id: string) => void;
  onUnban?: (id: string) => void;
  onChangeRole?: (id: string, role: string) => void;
  onDelete?: (id: string) => void;
  isCollapsed?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onView,
  onBan,
  onUnban,
  onChangeRole,
  onDelete,
  isCollapsed = false,
}) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };
  console.log("users: ", users);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {!isCollapsed && (
              <>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[130px]">Joined</TableHead>
                <TableHead className="w-[100px] text-center">
                  Followers
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Following
                </TableHead>
              </>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(users) &&
            users.map((profile) => {
              const u = profile.user; // tiện alias
              return (
                <TableRow key={profile.id}>
                  {/* Avatar + tên */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10, w-10">
                        <AvatarImage
                          src={profile.avatar || ""}
                          alt={u?.username || ""}
                        />
                        <AvatarFallback>
                          {getInitials(u?.firstName, u?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {u?.firstName || ""} {u?.lastName || ""}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{u?.username || "unknown"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {u?.email || "N/A"}
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge
                      variant={u?.role === "ADMIN" ? "default" : "secondary"}
                      className={
                        u?.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : ""
                      }
                    >
                      {u?.role || "USER"}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {u?.status === UserStatus.ACTIVE && (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                    {u?.status === UserStatus.BANNED && (
                      <Badge className="bg-red-100 text-red-800">Banned</Badge>
                    )}
                    {u?.status === UserStatus.SUSPENDED && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Suspended
                      </Badge>
                    )}
                    {u?.status === UserStatus.PENDING && (
                      <Badge className="bg-gray-100 text-gray-800">
                        Pending
                      </Badge>
                    )}
                  </TableCell>

                  {/* Joined date */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {u?.createdAt ? formatDate(u.createdAt, "short") : "N/A"}
                    </div>
                  </TableCell>

                  {/* Followers / Following */}
                  <TableCell>{profile.followersCount ?? 0}</TableCell>
                  <TableCell>{profile.followingCount ?? 0}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(profile)}>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(profile)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>

                        {u?.status === UserStatus.BANNED ? (
                          <DropdownMenuItem
                            onClick={() => u?.id && onUnban?.(u.id)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => u?.id && onBan?.(u.id)}
                            className="text-destructive"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() =>
                            u?.id &&
                            onChangeRole?.(
                              u.id,
                              u.role === "ADMIN" ? "USER" : "ADMIN"
                            )
                          }
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Change to {u?.role === "ADMIN" ? "User" : "Admin"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
