// app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NeuroNet - Kết nối thế giới",
  description: "Đăng nhập để kết nối với cộng đồng của bạn",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900 text-white">
      {/* Background video với hiệu ứng mờ */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="/videos/background-connect-global.mp4"
      />

      {/* Lớp phủ gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />

      {/* Nội dung chính */}
      <div className="relative z-20 h-full flex">
        {/* Phần bên trái - Nội dung giới thiệu */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 space-y-8">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Chào mừng đến với <span className="text-blue-400">NeuroNet</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Nền tảng kết nối toàn cầu - Nơi ý tưởng gặp gỡ và sáng tạo bùng nổ
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">Kết nối với cộng đồng toàn cầu</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">Khám phá những ý tưởng mới</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">Chia sẻ kiến thức của bạn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần bên phải - Form đăng nhập/đăng ký */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          {children}
        </div>
      </div>
    </main>
  );
}