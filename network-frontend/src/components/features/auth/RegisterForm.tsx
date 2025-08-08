"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { register, resendVerification } from "@/redux/features/auth/authThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useEffect, useState } from "react";

const formSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ"),
  firstName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: z.string().min(2, "Họ phải có ít nhất 2 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function RegisterForm() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const RESEND_DELAY = process.env.NEXT_PUBLIC_RESEND_VERIFICATION_DELAY
    ? parseInt(process.env.NEXT_PUBLIC_RESEND_VERIFICATION_DELAY)
    : 60;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await dispatch(register(values)).unwrap();
      setRegisteredEmail(values.email);
      setCountdown(RESEND_DELAY);
      // router.push("/login");
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng kiểm tra email để xác thực tài khoản",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;

    try {
      await dispatch(resendVerification(registeredEmail)).unwrap();
      setCountdown(RESEND_DELAY);
      toast({
        title: "Đã gửi lại email xác thực",
        description: "Vui lòng kiểm tra hộp thư của bạn",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Gửi lại email thất bại",
        description: error.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  if (registeredEmail) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Xác thực email</h2>
          <p className="text-gray-300">
            Chúng tôi đã gửi liên kết xác thực đến{" "}
            <span className="font-semibold">{registeredEmail}</span>
          </p>
          {countdown > 0 && (
            <p className="text-sm text-gray-400">
              Bạn có thể gửi lại email sau {countdown} giây
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleResendVerification}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isResending || countdown > 0}
          >
            {isResending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            ) : countdown > 0 ? (
              `Gửi lại (${countdown}s)`
            ) : (
              "Gửi lại email xác thực"
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10 text-white"
            onClick={() => router.push("/login")}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-5">
          <FormField
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="abc@gmail.com"
                    {...field}
                    className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên của bạn"
                      {...field}
                      className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Họ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập họ của bạn"
                      {...field}
                      className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold cursor-pointer"
          >
            Đăng ký
          </Button>
        </div>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-gray-400">
            Đã có tài khoản?
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white"
          onClick={() => router.push("/login")}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </div>
  );
}
