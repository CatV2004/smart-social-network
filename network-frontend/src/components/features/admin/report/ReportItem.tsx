import React, { useState } from "react";
import { Report, ReportStatus, ReportType } from "@/types/report";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ImageMedia, VideoMedia } from "@/types/media";
import { useAppSelector } from "@/redux/hooks";

interface ReportItemProps {
  report: Report;
  onViewDetails: (reportId: string) => void;
  onApprove: (reportId: string) => void;
  onReject: (reportId: string) => void;
}

const ReportItem: React.FC<ReportItemProps> = ({
  report,
  onViewDetails,
  onApprove,
  onReject,
}) => {
  const { reportLoading } = useAppSelector((state) => state.reports);
  const isLoading = reportLoading[report.id] || false;

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ReportStatus.REVIEWED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReportStatus.RESOLVED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case ReportType.POST:
        return <DocumentTextIcon className="w-4 h-4" />;
      case ReportType.COMMENT:
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case ReportType.USER:
        return <UserIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderMediaPreview = () => {
    if (!report.post.media || report.post.media.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <DocumentTextIcon className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    const media = report.post.media[0];

    if (media.type === "IMAGE") {
      const imageMedia = media as ImageMedia;
      return (
        <img
          src={imageMedia.url}
          alt="Report content"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }

    if (media.type === "VIDEO") {
      const videoMedia = media as VideoMedia;
      return (
        <div className="w-full h-full relative">
          <video className="w-full h-full object-cover rounded-lg" controls>
            <source src={videoMedia.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">▶</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAIAnalysisResult = () => {
    if (!report.aiAnalysis || !report.aiAnalysis.predictions.length) {
      return {
        label: "Chưa phân tích",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        confidence: 0,
      };
    }

    const violencePred = report.aiAnalysis.predictions.find(
      (p) => p.label.toLowerCase() === "violence"
    );

    const nonViolencePred = report.aiAnalysis.predictions.find(
      (p) => p.label.toLowerCase() === "non-violence"
    );

    // Nếu không tìm thấy prediction nào, trả về cần xem xét
    if (!violencePred || !nonViolencePred) {
      return {
        label: "Cần xem xét",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        confidence: 0,
      };
    }

    const threshold = 50;
    if (violencePred.probability >= threshold) {
      return {
        label: "Có bạo lực",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        confidence: violencePred.probability,
      };
    } else if (nonViolencePred.probability >= threshold) {
      return {
        label: "Không bạo lực",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <ShieldCheckIcon className="w-4 h-4" />,
        confidence: nonViolencePred.probability,
      };
    } else {
      // Trường hợp cả hai xác suất đều thấp
      return {
        label: "Cần xem xét",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        confidence: Math.max(
          violencePred.probability,
          nonViolencePred.probability
        ),
      };
    }
  };

  const aiAnalysis = getAIAnalysisResult();

  // Lấy tỷ lệ violence cụ thể để hiển thị
  const getViolenceProbability = () => {
    if (!report.aiAnalysis) return 0;
    const violencePred = report.aiAnalysis.predictions.find((p) =>
      p.label.toLowerCase().includes("violence")
    );
    return violencePred ? violencePred.probability : 0;
  };

  const violenceProbability = getViolenceProbability();

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow ${
        isLoading ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-row gap-4 md:gap-6 h-48 md:h-65">
        <div className="w-56 h-56 flex-shrink-0">{renderMediaPreview()}</div>

        {/* Content - Chiếm phần còn lại bên phải */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                  report.status
                )}`}
              >
                {getTypeIcon(report.type)}
                {report.type}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${aiAnalysis.color}`}
              >
                {aiAnalysis.icon}
                {aiAnalysis.label}
              </span>
            </div>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                report.status
              )} capitalize`}
            >
              {report.status}
            </span>
          </div>

          {/* Reason & Content */}
          <div className="mt-2 overflow-hidden">
            <p className="truncate">
              <span className="font-medium text-gray-900">Lý do:</span>{" "}
              <span className="text-gray-700">{report.reason}</span>
            </p>
            {report.post.content && (
              <p className="mt-1 text-gray-600 line-clamp-2">
                <span className="font-medium text-gray-900">Nội dung:</span>{" "}
                {report.post.content}
              </p>
            )}
          </div>

          {/* AI Analysis */}
          {report.aiAnalysis && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg overflow-y-auto flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Phân tích AI:
                </span>
                <span className="text-xs text-gray-500">
                  Model {report.aiAnalysis.modelVersion}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Khả năng bạo lực:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {violenceProbability.toFixed(1)}%
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full rounded-full bg-red-500 transition-all"
                        style={{ width: `${violenceProbability}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {report.aiAnalysis.predictions.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{p.label}:</span>
                      <span className="font-medium text-gray-900">
                        {p.probability.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-gray-500 mt-2">
            Báo cáo lúc: {formatDate(report.createdAt)}
            {report.aiAnalysis?.reviewedAt && (
              <span className="ml-2">
                • Phân tích: {formatDate(report.aiAnalysis.reviewedAt)}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => onViewDetails(report.id)}
              disabled={isLoading}
              className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <EyeIcon className="w-4 h-4" />
              Xem chi tiết
            </button>

            {report.status === ReportStatus.PENDING && (
              <>
                <button
                  onClick={() => onApprove(report.id)}
                  disabled={isLoading}
                  className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className=" animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                  ) : (
                    <CheckCircleIcon className="w-4 h-4" />
                  )}
                  {isLoading ? "Đang xử lý..." : "Duyệt"}
                </button>
                <button
                  onClick={() => onReject(report.id)}
                  disabled={isLoading}
                  className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                  ) : (
                    <XCircleIcon className="w-4 h-4" />
                  )}
                  {isLoading ? "Đang xử lý..." : "Từ chối"}
                </button>
              </>
            )}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="mt-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-xs text-gray-500">
                Đang xử lý báo cáo...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
