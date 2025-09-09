import React, { useEffect, useState } from "react";
import { Report, ReportStatus, ReportType } from "@/types/report";
import ReportItem from "./ReportItem";
import {
  FunnelIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  approveReport,
  fetchReports,
  rejectReport,
  updateReportStatus,
} from "@/redux/features/report/reportThunks";
import { resetFilters, setFilters } from "@/redux/features/report/reportSlice";
import ReportDetail from "./ReportDetail";

const ReportList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error, pagination, filters } = useAppSelector(
    (state) => state.reports
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    loadReports(1);
  }, [dispatch, filters]);

  const loadReports = (page: number = 1) => {
    dispatch(
      fetchReports({
        page,
        limit: 10,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: filters.status,
        type: filters.type,
      })
    );
  };
  console.log("reports: ", reports);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages && !loading) {
      loadReports(pagination.page + 1);
    }
  };

  const handleFilterApply = () => {
    dispatch(
      setFilters({
        status: selectedStatus || undefined,
        type: selectedType || undefined,
      })
    );
  };

  const handleResetFilters = () => {
    setSelectedStatus("");
    setSelectedType("");
    dispatch(resetFilters());
  };

  const handleSortChange = (sortOrder: "ASC" | "DESC") => {
    dispatch(
      setFilters({
        sortBy: "createdAt",
        sortOrder,
      })
    );
  };

  const handleViewDetails = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleCloseDetail = () => {
    setSelectedReportId(null);
  };

  const handleApprove = (reportId: string) => {
    dispatch(approveReport(reportId));
  };

  const handleReject = (reportId: string) => {
    dispatch(rejectReport(reportId));
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Đang tải báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">Lỗi</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => loadReports(1)}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header với filters */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Báo cáo</h1>
          <button
            onClick={() => loadReports(1)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value={ReportStatus.PENDING}>Đang chờ</option>
                <option value={ReportStatus.REVIEWED}>Đã xem xét</option>
                <option value={ReportStatus.RESOLVED}>Đã giải quyết</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả loại</option>
                <option value={ReportType.POST}>Bài viết</option>
                <option value={ReportType.COMMENT}>Bình luận</option>
                <option value={ReportType.USER}>Người dùng</option>
              </select>

              <button
                onClick={handleFilterApply}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                Áp dụng
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange("DESC")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                  filters.sortOrder === "DESC"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <ArrowDownIcon className="w-4 h-4" />
                Mới nhất
              </button>
              <button
                onClick={() => handleSortChange("ASC")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                  filters.sortOrder === "ASC"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <ArrowUpIcon className="w-4 h-4" />
                Cũ nhất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FunnelIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.status || filters.type
                ? "Không tìm thấy báo cáo nào phù hợp"
                : "Chưa có báo cáo nào"}
            </h3>
            <p className="text-gray-600">
              {filters.status || filters.type
                ? "Hãy thử thay đổi bộ lọc để xem thêm kết quả"
                : "Tất cả báo cáo sẽ xuất hiện ở đây"}
            </p>
          </div>
        ) : (
          <>
            {reports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}

            {/* Load More */}
            {pagination && pagination.page < pagination.totalPages && (
              <div className="text-center pt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Đang tải..."
                    : `Tải thêm (${pagination.total - reports.length} còn lại)`}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {pagination && (
              <div className="text-center text-sm text-gray-500 pt-4">
                Hiển thị {reports.length} của {pagination.total} báo cáo
              </div>
            )}
          </>
        )}
        {selectedReportId && (
          <ReportDetail
            reportId={selectedReportId}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ReportList;
