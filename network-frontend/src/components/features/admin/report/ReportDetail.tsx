import React, { useEffect, useState } from "react";
import { Report, ReportStatus, ReportType } from "@/types/report";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserCircleIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { ImageMedia, VideoMedia } from "@/types/media";
import reportApi from "@/lib/api/report.api";

interface ReportDetailProps {
  reportId: string;
  onApprove: (reportId: string) => void;
  onReject: (reportId: string) => void;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({
  reportId,
  onApprove,
  onReject,
  onClose,
}) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!reportId) return;

    setLoading(true);
    reportApi
      .getReportById(reportId)
      .then((res) => setReport(res.data))
      .finally(() => setLoading(false));
  }, [reportId]);

  console.log("report; ", report);

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
        return <DocumentTextIcon className="w-5 h-5" />;
      case ReportType.COMMENT:
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
      case ReportType.USER:
        return <UserIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <ClockIcon className="h-6 w-6 mx-auto animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Đang tải báo cáo...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 text-center">
        <XCircleIcon className="h-6 w-6 mx-auto text-red-500" />
        <p className="mt-2 text-sm text-gray-500">Không tìm thấy báo cáo</p>
      </div>
    );
  }

  const renderMedia = () => {
    if (!report.post.media || report.post.media.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <DocumentTextIcon className="w-12 h-12 text-gray-400" />
        </div>
      );
    }

    return report.post.media.map((media, index) => {
      if (media.type === "IMAGE") {
        const imageMedia = media as ImageMedia;
        return (
          <div key={index} className="mb-4">
            <img
              src={imageMedia.url}
              alt={`Report content ${index + 1}`}
              className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
            />
            <div className="mt-1 text-sm text-gray-500">
              Kích thước: {imageMedia.width} × {imageMedia.height} px
            </div>
          </div>
        );
      }

      if (media.type === "VIDEO") {
        const videoMedia = media as VideoMedia;
        return (
          <div key={index} className="mb-4">
            <video
              className="w-full max-h-96 rounded-lg border border-gray-200"
              controls
            >
              <source src={videoMedia.url} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
            {videoMedia.duration && (
              <div className="mt-1 text-sm text-gray-500">
                Thời lượng: {videoMedia.duration}s
              </div>
            )}
          </div>
        );
      }

      return null;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
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
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        confidence: 0,
      };
    }

    const violencePred = report.aiAnalysis.predictions.find(
      (p) => p.label.toLowerCase() === "violence"
    );

    const nonViolencePred = report.aiAnalysis.predictions.find(
      (p) => p.label.toLowerCase() === "non-violence"
    );

    if (!violencePred || !nonViolencePred) {
      return {
        label: "Cần xem xét",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        confidence: 0,
      };
    }

    const threshold = 50;
    if (violencePred.probability >= threshold) {
      return {
        label: "Có bạo lực",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        confidence: violencePred.probability,
      };
    } else if (nonViolencePred.probability >= threshold) {
      return {
        label: "Không bạo lực",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        confidence: nonViolencePred.probability,
      };
    } else {
      return {
        label: "Cần xem xét",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        confidence: Math.max(
          violencePred.probability,
          nonViolencePred.probability
        ),
      };
    }
  };

  const aiAnalysis = getAIAnalysisResult();

  const getViolenceProbability = () => {
    if (!report.aiAnalysis) return 0;
    const violencePred = report.aiAnalysis.predictions.find(
      (p) => p.label.toLowerCase() === "violence"
    );
    return violencePred ? violencePred.probability : 0;
  };

  const violenceProbability = getViolenceProbability();

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FlagIcon className="w-6 h-6 text-red-500" />
            Chi tiết báo cáo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  report.status
                )} capitalize`}
              >
                {report.status}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Loại báo cáo
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  report.status
                )}`}
              >
                {getTypeIcon(report.type)}
                {report.type}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Kết quả AI</h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${aiAnalysis.color}`}
              >
                {aiAnalysis.icon}
                {aiAnalysis.label}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Thời gian báo cáo
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-900">
                <ClockIcon className="w-4 h-4" />
                {formatDate(report.createdAt)}
              </div>
            </div>
          </div>

          {/* Người báo cáo */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Người báo cáo
            </h3>
            {report.reporter ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {report.reporter.firstName} {report.reporter.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    @{report.reporter.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {report.reporter.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">AI System</p>
                  <p className="text-sm text-gray-500">
                    Model version: {report.aiAnalysis?.modelVersion || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lý do báo cáo */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Lý do báo cáo
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900">{report.reason}</p>
            </div>
          </div>

          {/* Nội dung được báo cáo */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Nội dung được báo cáo
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              {report.post.content && (
                <div className="mb-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {report.post.content}
                  </p>
                </div>
              )}

              {report.post.media && report.post.media.length > 0 && (
                <div className="mt-4">{renderMedia()}</div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Thông tin bài đăng
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Lượt thích:</span>{" "}
                    <span className="font-medium">
                      {report.post.likesCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bình luận:</span>{" "}
                    <span className="font-medium">
                      {report.post.commentsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Đã chỉnh sửa:</span>{" "}
                    <span className="font-medium">
                      {report.post.isEdited ? "Có" : "Không"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày đăng:</span>{" "}
                    <span className="font-medium">
                      {formatDate(report.post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tác giả bài đăng */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Tác giả bài đăng
            </h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {report.post.author.avatar ? (
                <img
                  src={report.post.author.avatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {report.post.author.user?.firstName}{" "}
                  {report.post.author.user?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  @{report.post.author.user?.username}
                </p>
                <p className="text-sm text-gray-500">
                  {report.post.author.user?.email}
                </p>
                {report.post.author.bio && (
                  <p className="text-sm text-gray-500 mt-1">
                    {report.post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phân tích AI chi tiết */}
          {report.aiAnalysis && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Phân tích AI chi tiết
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-900">
                    Kết quả phân tích
                  </span>
                  <span className="text-xs text-gray-500">
                    Model {report.aiAnalysis.modelVersion} •{" "}
                    {formatDate(report.aiAnalysis.reviewedAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">
                        Khả năng bạo lực:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {violenceProbability.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div
                        className="h-full rounded-full bg-red-500 transition-all"
                        style={{ width: `${violenceProbability}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.aiAnalysis.predictions.map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 bg-white rounded border"
                      >
                        <span className="text-sm text-gray-600">
                          {p.label}:
                        </span>
                        <span className="font-medium text-gray-900">
                          {p.probability.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer với các nút hành động */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>

          {report.status === ReportStatus.PENDING && (
            <div className="flex gap-2">
              <button
                onClick={() => onReject(report.id)}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
              >
                <XCircleIcon className="w-5 h-5" />
                Từ chối
              </button>
              <button
                onClick={() => onApprove(report.id)}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
