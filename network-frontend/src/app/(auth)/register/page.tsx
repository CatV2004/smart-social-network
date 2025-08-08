import { Metadata } from "next";
import RegisterForm from "@/components/features/auth/RegisterForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Tạo tài khoản mới để kết nối với cộng đồng",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Điền thông tin để bắt đầu hành trình cùng chúng tôi"
    >
      <RegisterForm />
    </AuthLayout>
  );
}