"use client";
import { useState, useRef, useEffect, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import { setActiveOverlay } from "@/redux/features/ui/uiSlice";
import SettingsMenu from "@/components/features/navigation/SettingsMenu";
import { getSidebarNavItems } from "./sidebar.config";
import { SidebarNav } from "./SidebarNav";
import { PostCreateModal } from "@/components/shared/modals/PostCreateModal";
import { SearchOverlay } from "@/components/features/search/SearchOverlay";
import { NotificationsOverlay } from "@/components/features/notification/NotificationsOverlay";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function SidebarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const currentProfile = useAppSelector(selectMyProfile);
  const activeOverlay = useAppSelector((state) => state.ui.activeOverlay);

  const [openModal, setOpenModal] = useState<null | "create">(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        setIsCollapsed(true);
        setIsTransitioning(false);
        dispatch(setActiveOverlay(item.overlay));
      }
      return;
    }

    e.preventDefault();
    if (activeOverlay !== "none") {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      setIsCollapsed(false);
      setIsTransitioning(false);
      // Reset active overlay khi đóng overlay
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
      setIsCollapsed(false);
      setIsTransitioning(false);
      // Reset active overlay khi đóng
      dispatch(setActiveOverlay("none"));
    }
  };

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      // Thêm điều kiện kiểm tra xem click có phải trên overlay không
      const clickedElement = event.target as HTMLElement;
      const isOverlay = clickedElement.closest("[data-overlay]");

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !isOverlay // KHÔNG đóng nếu click trên overlay
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
          animate={{ width: isCollapsed ? 80 : 256 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full nav-medium-sidebar z-20 p-3 hidden md:flex flex-col border-r border-gray-200 overflow-hidden"
        >
          <div className="h-[60px] flex items-center justify-center mb-5 mt-5">
            <AnimatePresence mode="wait">
              {isCollapsed ? (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/">
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
              isCollapsed={isCollapsed}
              isTransitioning={isTransitioning}
              activeOverlay={activeOverlay}
            />
          </nav>

          <SettingsMenu isCollapsed={isCollapsed} />
        </motion.aside>

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
