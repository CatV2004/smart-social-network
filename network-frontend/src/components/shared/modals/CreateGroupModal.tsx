"use client";

import { useState, useEffect } from "react";
import { X, Search, Users, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/cn";
import { FollowRequest } from "@/types/follow-request";

interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  username?: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreate: (groupData: {
    name: string;
    participantIds: string[];
  }) => Promise<void>;
  friends: FollowRequest[];
  isLoading?: boolean;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreate,
  friends,
  isLoading = false,
}: CreateGroupModalProps) {
  const [step, setStep] = useState<"name" | "members">("name");
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hiệu ứng khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setStep("name");
      setGroupName("");
      setSearchTerm("");
      setSelectedMembers([]);
      setIsCreating(false);
      onClose();
    }, 300); // Thời gian khớp với duration của animation
  };

  // Chuyển đổi dữ liệu từ FollowRequest sang User
  const formatFriends = (friendsData: FollowRequest[]): User[] => {
    return friendsData.map((friend) => ({
      id: friend.profile.user.id,
      name: `${friend.profile.user.firstName} ${friend.profile.user.lastName}`,
      avatar: friend.profile.avatar || "",
      email: friend.profile.user.email,
      username: friend.profile.user.username,
    }));
  };

  const formattedFriends = formatFriends(friends);

  const filteredFriends = formattedFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberSelect = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (groupName.trim() && step === "name") {
      setStep("members");
    }
  };

  const handleBack = () => {
    if (step === "members") {
      setStep("name");
    }
  };

  const handleCreateGroup = async () => {
    if (selectedMembers.length < 2) {
      alert("Vui lòng chọn ít nhất 2 thành viên");
      return;
    }

    setIsCreating(true);
    try {
      await onGroupCreate({
        name: groupName,
        participantIds: selectedMembers,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedMembersData = formattedFriends.filter((friend) =>
    selectedMembers.includes(friend.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        overlayProps={{
          dimOpacity: 10,
          blur: false,
        }}
        className={cn(
          "sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl border-0 bg-white shadow-xl transition-all duration-300",
          isAnimating
            ? "animate-in fade-in-0 zoom-in-95"
            : "animate-out fade-out-0 zoom-out-95"
        )}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {step === "members" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {step === "name" ? "Tạo nhóm mới" : "Thêm thành viên"}
                </DialogTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          {step === "name" && (
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Tên nhóm
                </label>
                <Input
                  placeholder="Nhập tên nhóm..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  Đặt tên dễ nhớ để mọi người dễ dàng nhận biết nhóm
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="cursor-pointer rounded-xl h-11 px-6 border-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!groupName.trim()}
                  className="cursor-pointer rounded-xl h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {step === "members" && (
            <div className="p-6 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bạn bè..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Selected members */}
              {selectedMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Đã chọn ({selectedMembers.length})
                    </h4>
                    {selectedMembers.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMembers([])}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Bỏ chọn tất cả
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="max-h-32">
                    <div className="flex flex-wrap gap-2">
                      {selectedMembersData.map((member) => (
                        <Badge
                          key={member.id}
                          variant="secondary"
                          className="px-3 py-2 rounded-full flex items-center gap-2 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMemberSelect(member.id);
                            }}
                            className="h-4 w-4 rounded-full ml-1 hover:bg-blue-200"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Friends list */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Bạn bè ({filteredFriends.length})
                </h4>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {filteredFriends.map((friend) => {
                        const isSelected = selectedMembers.includes(friend.id);
                        return (
                          <div
                            key={friend.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200",
                              isSelected
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50 border border-transparent"
                            )}
                            onClick={() => handleMemberSelect(friend.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                                  {friend.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm text-gray-900">
                                  {friend.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {friend.username || friend.email}
                                </p>
                              </div>
                            </div>
                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {selectedMembers.length} thành viên được chọn
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-xl h-11 px-6 border-gray-300 hover:bg-gray-50"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleCreateGroup}
                    disabled={selectedMembers.length < 2 || isCreating}
                    // loading={isCreating}
                    className="rounded-xl h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                  >
                    Tạo nhóm
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
