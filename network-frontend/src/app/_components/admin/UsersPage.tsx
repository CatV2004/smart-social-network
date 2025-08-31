"use client";

import React, { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import UserFilters from "@/components/features/admin/userManagement/UserFilters";
import UserTable from "@/components/features/admin/userManagement/UserTable";
import Pagination from "@/components/features/admin/Pagination";
import { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, X } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import UserEditModal from "@/components/features/admin/userManagement/UserEditModal";
import UserProfilePanel from "@/components/features/admin/userManagement/UserProfilePanel";
import { banUser, unbanUser } from "@/redux/features/user/userThunks";
import { useAppDispatch } from "@/redux/hooks";

const UsersPage: React.FC = () => {
  const {
    users,
    filters,
    loading,
    error,
    pagination,
    loadUsers,
    updateFilters,
    resetAll,
    clearError,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  // fetch lần đầu
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    updateFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetAll();
    loadUsers();
  };

  const handlePageChange = (page: number) => {
    handleFiltersChange({ page });
  };

  const handleViewUser = (user: Profile) => {
    setSelectedUser(user);
    setIsProfilePanelOpen(true);
    setIsTableCollapsed(true);
  };

  const handleCloseProfilePanel = () => {
    setIsProfilePanelOpen(false);
    setIsTableCollapsed(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleBanUser = (id: string) => {
    dispatch(banUser(id))
      .unwrap()
      .then(() => loadUsers()); 
  };

  const handleUnbanUser = (id: string) => {
    dispatch(unbanUser(id))
      .unwrap()
      .then(() => loadUsers());
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Main Container - sẽ bị đẩy sang trái khi panel mở */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${isProfilePanelOpen ? "mr-80" : ""}
      `}
      >
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8" />
                <h1 className="text-3xl font-bold">User Management</h1>
              </div>
              <Button
                onClick={() => loadUsers()}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Manage all users in the system, view their details, and perform
              administrative actions.
            </p>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => {
                clearError();
                loadUsers();
              }}
              className="mb-6"
            />
          )}

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {/* Table */}
          <div className="mt-6">
            <UserTable
              users={users}
              onView={handleViewUser}
              onEdit={handleEditUser}
              isCollapsed={isTableCollapsed}
              onBan={handleBanUser}
              onUnban={handleUnbanUser}
              // onChangeRole={handleChangeRole}
              // onDelete={handleDeleteUser}
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Edit Modal */}
          {selectedUser && (
            <UserEditModal
              user={selectedUser}
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              onUserUpdated={() => {
                loadUsers();
                setIsEditModalOpen(false);
              }}
              onCloseAndView={() => {
                setIsEditModalOpen(false);
                setIsProfilePanelOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Profile Panel - Fixed overlay */}
      <div
        className={`
        fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg
        transform transition-transform duration-300 ease-in-out z-50
        ${isProfilePanelOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {selectedUser && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">User Profile</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseProfilePanel}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <UserProfilePanel
                user={selectedUser}
                onClose={handleCloseProfilePanel}
                onEdit={() => {
                  setIsEditModalOpen(true);
                  setIsProfilePanelOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Overlay khi panel mở */}
      {isProfilePanelOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={handleCloseProfilePanel}
        />
      )}
    </div>
  );
};

export default UsersPage;
