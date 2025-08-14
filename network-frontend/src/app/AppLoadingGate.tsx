"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectUserLoading } from "@/redux/features/user/userSelectors";
import { Loader2, Rocket, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { selectProfileLoading } from "@/redux/features/profile/profileSelectors";

export default function AppLoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadingUser = useAppSelector(selectUserLoading);
  const loadingProfile = useAppSelector(selectProfileLoading);
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const isInitializing = loadingUser || loadingProfile;

  // Hiệu ứng progress bar động
  useEffect(() => {
    if (isInitializing) {
      setStartTime(Date.now());
      setShowLoader(true);
      setProgress(0);
    } else if (startTime) {
      const elapsed = Date.now() - startTime;
      const delay = elapsed < 500 ? 500 - elapsed : 0;
      const timer = setTimeout(() => setShowLoader(false), delay);
      return () => clearTimeout(timer);
    }
  }, [isInitializing]);

  // Hiệu ứng xuất hiện mượt mà
  useEffect(() => {
    if (showLoader && progress < 95) {
      const timer = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 10, 95));
      }, 150);
      return () => clearInterval(timer);
    } else if (!isInitializing) {
      setProgress(100);
    }
  }, [showLoader, isInitializing]);

  return (
    <>
      {children}

      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-black/30 to-purple-900/20 backdrop-blur-[4px] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 200,
              }}
              className="w-full max-w-xs p-6 rounded-2xl bg-white/90 dark:bg-gray-900/90 shadow-2xl border border-white/20 relative overflow-hidden"
            >
              {/* Progress bar */}
              <motion.div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />

              {/* Main content */}
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    y: [0, -5, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    y: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                  className="relative mb-4"
                >
                  <Loader2 className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Đang tải ứng dụng
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {progress < 30
                    ? "Đang chuẩn bị dữ liệu..."
                    : progress < 70
                    ? "Đang tải tài nguyên..."
                    : "Hoàn tất..."}
                </p>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex items-center mt-2">
                  <Rocket className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(progress)}% hoàn thành
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  x: [null, Math.random() * window.innerWidth],
                  y: [null, Math.random() * window.innerHeight],
                  scale: [0, Math.random() * 0.5 + 0.5, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
