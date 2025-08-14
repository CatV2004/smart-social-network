import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalStep = "select" | "preview" | "post-info";

interface PostCreateHeaderProps {
  step: ModalStep;
  onBack: () => void;
  onContinue?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

export function PostCreateHeader({
  step,
  onBack,
  onContinue,
  onShare,
  isLoading = false,
}: PostCreateHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      {step !== "select" ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
      ) : (
        <div className="w-[80px]" />
      )}

      <h2 className="text-lg font-bold">
        {step === "select"
          ? "Tạo bài viết mới"
          : step === "preview"
          ? "Xem trước"
          : "Tạo bài viết"}
      </h2>

      {step === "preview" ? (
        <Button size="sm" onClick={onContinue}>
          Tiếp tục
        </Button>
      ) : step === "post-info" ? (
        <Button size="sm" onClick={onShare} disabled={isLoading}>
          {isLoading ? "Đang đăng..." : "Chia sẻ"}
        </Button>
      ) : (
        <div className="w-[80px]" />
      )}
    </div>
  );
}
