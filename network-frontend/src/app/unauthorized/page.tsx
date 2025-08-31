"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authThunks";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleRelogin = async () => {
    setLoading(true);
    try {
      await dispatch(logout()).unwrap();
      router.replace("/admin/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Truy cập bị từ chối
        </h1>

        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản
          trị viên nếu bạn cho rằng đây là lỗi.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/home">
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleRelogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang đăng xuất...
              </>
            ) : (
              "Đăng nhập với tài khoản khác"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
