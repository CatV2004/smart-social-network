"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { login } from "@/redux/features/auth/authThunks";
import { Loader2, Shield } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string(),
});

export default function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth 
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dispatch(
        login({
          email: values.username,
          password: values.password,
        })
      ).unwrap();

      toast.success("Đăng nhập admin thành công!");
    } catch (error) {
      console.error("Admin login error:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div>
          <div className="flex justify-center items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng sử dụng tài khoản admin để tiếp tục
          </p>
        </div>

        <div className="space-y-6 relative">
          {/* Overlay loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          <Form form={form} onSubmit={onSubmit}>
            <div className="space-y-5">
              <FormField
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin_username"
                        {...field}
                        className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Link
                        href="/admin/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  "Đăng nhập Admin"
                )}
              </Button>
            </div>
          </Form>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ← Quay lại trang đăng nhập thường
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
