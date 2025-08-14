"use client";
import { useState, useRef, useEffect, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import SettingsMenu from "@/components/features/navigation/SettingsMenu";
import { getSidebarNavItems } from "./sidebar.config";
import { SidebarNav } from "./SidebarNav";
import { PostCreateModal } from "@/components/shared/modals/PostCreateModal";

function SidebarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppSelector(selectCurrentUser);
  const currentProfile = useAppSelector(selectMyProfile);

  const [openModal, setOpenModal] = useState<null | "create">(null);

  NProgress.configure({ showSpinner: false, trickleSpeed: 300, minimum: 0.3 });

  const navItems = getSidebarNavItems(currentUser?.id);

  const userAvatar =
    currentProfile?.avatar ||
    "https://res.cloudinary.com/dohsfqs6d/image/upload/v1754206154/avatarDefault_nbrjul.jpg";

  const handleItemClick = (e: any, item: any) => {
    if (item.action) {
      if (item.action === "openPostCreate") setOpenModal("create");
      return;
    }
    e.preventDefault();
    if (pathname !== item.href) {
      NProgress.start();
      router.push(item.href);
    }
  };

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        // Đóng menu nếu có
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <>
      <aside
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full nav-medium-sidebar z-10 p-6 hidden md:flex flex-col border-r border-gray-200"
      >
        {/* Logo */}
        <div className="mb-10 mt-5 text-center">
          <Link href="/">
            <h1
              style={{ fontFamily: "var(--font-playwrite)" }}
              className="text-2xl font-bold italic text-black cursor-pointer"
            >
              Smart Social
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <SidebarNav
            items={navItems}
            pathname={pathname}
            handleItemClick={handleItemClick}
            userAvatar={userAvatar}
          />
        </nav>

        <SettingsMenu />
      </aside>

      {/* Modal tạo bài viết */}
      <PostCreateModal
        open={openModal === "create"}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
}

export const Sidebar = memo(SidebarComponent);
