import { ReactNode } from "react";
import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";

export default function sidebarLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
