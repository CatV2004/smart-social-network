import { ReactNode } from "react";
import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";

export default function userLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AdminLayout>
  );
}
