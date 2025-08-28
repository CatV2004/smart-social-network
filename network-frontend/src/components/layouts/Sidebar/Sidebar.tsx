// components/layout/Sidebar/Sidebar.tsx
"use client";
import { useState, useRef, useEffect, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import {
  setActiveOverlay,
  setSidebarCollapse,
} from "@/redux/features/ui/uiSlice";
import SettingsMenu from "@/components/features/navigation/SettingsMenu";
import { getSidebarNavItems } from "./sidebar.config";
import { SidebarNav } from "./SidebarNav";
import { PostCreateModal } from "@/components/shared/modals/PostCreateModal";
import { SearchOverlay } from "@/components/features/search/SearchOverlay";
import { NotificationsOverlay } from "@/components/features/notification/NotificationsOverlay";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { selectIsSidebarCollapsed } from "@/redux/features/ui/uiSelectors";

function SidebarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const currentProfile = useAppSelector(selectMyProfile);
  const activeOverlay = useAppSelector((state) => state.ui.activeOverlay);
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);

  const [openModal, setOpenModal] = useState<null | "create">(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  NProgress.configure({ showSpinner: false, trickleSpeed: 300, minimum: 0.3 });

  const navItems = getSidebarNavItems(currentUser?.username);

  const userAvatar =
    currentProfile?.avatar ||
    "https://res.cloudinary.com/dohsfqs6d/image/upload/v1755532065/0b1fc966-29af-4528-9857-33d1025ff241.png";

  const handleItemClick = async (e: any, item: any) => {
    if (item.action) {
      if (item.action === "openPostCreate") setOpenModal("create");
      return;
    }

    if (item.overlay) {
      e.preventDefault();
      if (activeOverlay !== item.overlay) {
        setIsTransitioning(true);
        await new Promise((resolve) => setTimeout(resolve, 50));
        dispatch(setSidebarCollapse(true));
        setIsTransitioning(false);
        dispatch(setActiveOverlay(item.overlay));
      }
      return;
    }

    // Xử lý riêng cho tin nhắn
    if (item.href?.startsWith("/direct")) {
      e.preventDefault();
      if (activeOverlay !== "none") {
        setIsTransitioning(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        dispatch(setSidebarCollapse(false));
        setIsTransitioning(false);
        dispatch(setActiveOverlay("none"));
      }

      // Thu nhỏ sidebar khi vào trang tin nhắn
      dispatch(setSidebarCollapse(true));

      if (pathname !== item.href) {
        NProgress.start();
        router.push(item.href);
      }
      return;
    }

    e.preventDefault();
    if (activeOverlay !== "none") {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      dispatch(setSidebarCollapse(false));
      setIsTransitioning(false);
      dispatch(setActiveOverlay("none"));
    }

    if (pathname !== item.href) {
      NProgress.start();
      router.push(item.href);
    }
  };

  const handleCloseOverlay = async () => {
    if (activeOverlay !== "none") {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      dispatch(setSidebarCollapse(false));
      setIsTransitioning(false);
      dispatch(setActiveOverlay("none"));
    }
  };

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const isOverlay = clickedElement.closest("[data-overlay]");

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !isOverlay
      ) {
        if (activeOverlay !== "none") {
          handleCloseOverlay();
        }
      }
    };

    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [activeOverlay]);

  return (
    <>
      <div className="flex h-full">
        <motion.aside
          ref={sidebarRef}
          initial={false}
          animate={{ width: isSidebarCollapsed ? 80 : 256 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full nav-medium-sidebar z-20 p-3 hidden md:flex flex-col border-r border-gray-200 overflow-hidden"
        >
          <div className="h-[60px] flex items-center justify-center mb-5 mt-5">
            <AnimatePresence mode="wait">
              {isSidebarCollapsed ? (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/home">
                    <Image
                      src="/icons/logo.png"
                      alt="Smart Social Logo"
                      width={40}
                      height={40}
                    />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <Link href="/">
                    <h1
                      style={{ fontFamily: "var(--font-playwrite)" }}
                      className="text-2xl font-bold italic text-black cursor-pointer"
                    >
                      Smart Social
                    </h1>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-grow">
            <SidebarNav
              items={navItems}
              pathname={pathname}
              handleItemClick={handleItemClick}
              userAvatar={userAvatar}
              isCollapsed={isSidebarCollapsed}
              isTransitioning={isTransitioning}
              activeOverlay={activeOverlay}
            />
          </nav>
        </motion.aside>

        <div
          className={`fixed bottom-3 left-0 z-30 transition-all duration-300 ${
            isSidebarCollapsed ? "w-[80px]" : "w-[256px]"
          } px-3`}
        >
          <SettingsMenu isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Overlay components */}
        <SearchOverlay
          isOpen={activeOverlay === "search"}
          onClose={handleCloseOverlay}
          data-overlay="search"
        />

        <NotificationsOverlay
          isOpen={activeOverlay === "notifications"}
          onClose={handleCloseOverlay}
          data-overlay="notifications"
          router={router}
        />
      </div>

      {/* Modal tạo bài viết */}
      <PostCreateModal
        open={openModal === "create"}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
}

export const Sidebar = memo(SidebarComponent);
