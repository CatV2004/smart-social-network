import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Shield, Ban, CheckCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus } from "@/types/user";

interface UserEditModalProps {
  user: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  onCloseAndView: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  open,
  onOpenChange,
  onUserUpdated,
  onCloseAndView,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.user.firstName || "",
    lastName: user.user.lastName || "",
    email: user.user.email || "",
    username: user.user.username || "",
    role: user.user.role || "USER",
    status: user.user.status || UserStatus.ACTIVE,
    phoneNumber: user.phoneNumber || "",
    location: user.location || "",
    bio: user.bio || "",
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Saving user data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "User information updated successfully.",
        variant: "default",
      });

      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndView = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Saving user data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "User information updated successfully.",
        variant: "default",
      });

      onUserUpdated();
      onCloseAndView();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit User Profile</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* User Header */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar!} alt={user.user.username} />
            <AvatarFallback className="text-lg font-medium">
              {getInitials(user.user.firstName, user.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">
              {user.user.firstName} {user.user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{user.user.username}
            </p>
            <div className="flex gap-2 mt-1">
              <Badge
                variant={user.user.role === "ADMIN" ? "default" : "secondary"}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                {user.user.role}
              </Badge>
              <Badge
                variant={
                  user.user.status !== UserStatus.ACTIVE
                    ? "destructive"
                    : "default"
                }
                className="text-xs"
              >
                {user.user.status !== UserStatus.ACTIVE ? (
                  <Ban className="h-3 w-3 mr-1" />
                ) : (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {user.user.status !== UserStatus.ACTIVE ? "Banned" : "Active"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              BASIC INFORMATION
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter username"
                prefix={<User className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                prefix={<Mail className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              CONTACT INFORMATION
            </h4>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              PERMISSIONS
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <div className="flex items-center gap-3 p-2 border rounded-md">
                  <Switch
                    id="status"
                    checked={formData.status === UserStatus.ACTIVE}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "status",
                        checked ? UserStatus.ACTIVE : UserStatus.BANNED
                      )
                    }
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status === UserStatus.ACTIVE
                      ? "Active"
                      : "Banned"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">BIO</h4>
            <div className="space-y-2">
              <Label htmlFor="bio">About</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full min-h-[80px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAndView}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & View Profile"}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
