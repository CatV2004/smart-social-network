import React from 'react';
import { Metadata } from 'next';
import ReportContainer from '@/components/features/admin/report/ReportContainer';

export const metadata: Metadata = {
  title: 'Quản lý Báo cáo - Admin Dashboard',
  description: 'Trang quản lý các báo cáo trong hệ thống',
};

const ReportsPage: React.FC = () => {
  return <ReportContainer />;
};

export default ReportsPage;