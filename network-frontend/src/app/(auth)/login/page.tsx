import { Metadata } from "next";
import LoginForm from "@/components/features/auth/LoginForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Nhập email và mật khẩu để đăng nhập"
    >
      <LoginForm />
    </AuthLayout>
  );
}
