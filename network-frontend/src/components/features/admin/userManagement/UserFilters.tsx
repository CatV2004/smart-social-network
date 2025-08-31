import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import { UserFilters as UserFiltersType } from "@/types/user";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: Partial<UserFiltersType>) => void;
  onReset: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex-1">
        <Input
          placeholder="Search by name, email or username..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ search: e.target.value, page: 1 })}
          className="w-full"
          prefix={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={filters.role || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              role: value === "all" ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy || "createdAt"}
          onValueChange={(value) => onFiltersChange({ sortBy: value, page: 1 })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="username">Username</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder || "DESC"}
          onValueChange={(value) =>
            onFiltersChange({ sortOrder: value as "ASC" | "DESC", page: 1 })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Descending</SelectItem>
            <SelectItem value="ASC">Ascending</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
