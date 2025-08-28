import { Search, MessageSquarePlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

interface ConversationHeaderProps {
  searchTerm?: string;
  filterType: "all" | "unread" | "pinned";
  onSearchChange: (value: string) => void;
  onFilterChange: (type: "all" | "unread" | "pinned") => void;
  onNewGroup: () => void;
  isLoading?: boolean;
}

export function ConversationHeader({
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
  onNewGroup,
  isLoading = false,
}: ConversationHeaderProps) {
  return (
    <div className="p-5 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-900">Tin nhắn</h2>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 text-gray-600"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border border-gray-200 shadow-md"
            >
              <DropdownMenuItem
                onClick={() => onFilterChange("all")}
                className={cn(
                  "cursor-pointer",
                  filterType === "all" && "bg-gray-100 text-gray-900"
                )}
              >
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange("unread")}
                className={cn(
                  "cursor-pointer",
                  filterType === "unread" && "bg-gray-100 text-gray-900"
                )}
              >
                Chưa đọc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFilterChange("pinned")}
                className={cn(
                  "cursor-pointer",
                  filterType === "pinned" && "bg-gray-100 text-gray-900"
                )}
              >
                Đã ghim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewGroup}
            className="rounded-full hover:bg-gray-100 text-gray-600"
            disabled={isLoading}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm hội thoại..."
          className="pl-9 bg-gray-100 border-gray-200 rounded-lg focus-visible:ring-blue-500/30"
          value={searchTerm || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
