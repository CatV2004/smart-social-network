'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { verifyEmail } from '@/redux/features/auth/authThunks';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await dispatch(verifyEmail(token)).unwrap();
          toast({
            title: 'Xác thực thành công',
            description: 'Tài khoản của bạn đã được xác thực',
            variant: 'default',
          });
          router.push('/login');
        } catch (error: any) {
          toast({
            title: 'Xác thực thất bại',
            description: error.message || 'Token không hợp lệ hoặc đã hết hạn',
            variant: 'destructive',
          });
          router.push('/register');
        }
      };
      verify();
    } else {
      router.push('/register');
    }
  }, [token, dispatch, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Đang xác thực email...</h1>
        <p>Vui lòng chờ trong giây lát</p>
        <Button onClick={() => router.push('/')}>Về trang chủ</Button>
      </div>
    </div>
  );
}