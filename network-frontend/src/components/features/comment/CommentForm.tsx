// components/features/comment/CommentForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { useToast } from "@/components/ui/use-toast";
import { Comment } from "@/types/comment";

interface CommentFormProps {
  avatarUrl?: string;
  avatarFallback: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  replyingTo?: Comment | null;
  onCancelReply?: () => void;
}

export function CommentForm({
  avatarUrl,
  avatarFallback,
  onSubmit,
  isSubmitting = false,
  replyingTo,
  onCancelReply,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (replyingTo) {
      setContent(`@${replyingTo.author.user?.firstName} `);
    } else {
      setContent("");
    }
  }, [replyingTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đăng bình luận thất bại. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t sticky bottom-0 bg-white"
    >
      {/* Reply preview */}
      {replyingTo && (
        <div className="flex items-center justify-between mb-2 px-2 py-1 bg-blue-50 rounded">
          <span className="text-sm text-blue-600">
            Đang phản hồi @{replyingTo.author.user?.firstName}{" "}
            {replyingTo.author.user?.lastName}
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            Hủy
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={replyingTo ? "Viết phản hồi..." : "Thêm bình luận..."}
            className="w-full border rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Thêm emoji"
            >
              <FontAwesomeIcon icon={Icons.emoji} size="xs" />
            </button>
          </div>
        </div>
        <Button
          type="submit"
          variant="ghost"
          className="text-blue-500 hover:text-blue-600 font-medium px-2 py-1 text-sm"
          disabled={!content.trim() || isSubmitting}
          aria-label="Đăng bình luận"
        >
          {isSubmitting ? "Đang đăng..." : "Đăng"}
        </Button>
      </div>
    </form>
  );
}
