import { useState } from "react";
import { Post } from "@/types/post";
import { CreateReportPayload, ReportType } from "@/types/report";
import { useToast } from "@/components/ui/use-toast";
import reportApi from "@/lib/api/report.api";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onReportSuccess?: () => void;
}

export function ReportModal({
  isOpen,
  onClose,
  post,
  onReportSuccess,
}: ReportModalProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();

  const handleReportConfirm = async () => {
    if (!post || !reportReason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do báo cáo",
        variant: "destructive",
      });
      return;
    }

    setIsReporting(true);
    try {
      const payload: CreateReportPayload = {
        postId: post.id,
        type: ReportType.POST,
        reason: reportReason,
      };

      await reportApi.createReport(payload);

      setReportReason("");
      onClose();

      toast({
        title: "Thành công",
        description: "Báo cáo đã được gửi thành công!",
      });

      onReportSuccess?.();
    } catch (error: any) {
      console.error("Lỗi khi báo cáo bài viết:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.";

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsReporting(false);
    }
  };

  const handleCancel = () => {
    setReportReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Báo cáo bài viết</h3>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng cho chúng tôi biết lý do bạn báo cáo bài viết này.
        </p>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Nhập lý do báo cáo..."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          disabled={isReporting}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleCancel}
            disabled={isReporting}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReportConfirm}
            disabled={isReporting || !reportReason.trim()}
          >
            {isReporting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi...
              </>
            ) : (
              "Gửi báo cáo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
