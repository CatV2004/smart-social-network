import { motion, Easing } from "framer-motion";

interface LoadingSkeletonProps {
  type: "stories" | "posts" | "suggestions" | "follow-requests";
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  type,
  count = 5,
  className = "",
}: LoadingSkeletonProps) {
  // Shimmer animation (di chuyển gradient ngang qua)
  const shimmer = {
    initial: { backgroundPosition: "-200% 0" },
    animate: { backgroundPosition: "200% 0" },
  };

  const shimmerStyle =
    "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800";

  // Common animation settings
  const animationProps = {
    variants: shimmer,
    initial: "initial" as const,
    animate: "animate" as const,
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
      repeatDelay: 0.2,
    },
  };

  if (type === "stories") {
    return (
      <div className={`flex gap-4 overflow-x-hidden py-4 px-2 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <motion.div
              {...animationProps}
              className={`w-16 h-16 rounded-full ${shimmerStyle} border-2 border-white dark:border-gray-900 shadow-sm`}
            />
            <motion.div
              {...animationProps}
              className={`h-2 w-10 rounded ${shimmerStyle}`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "posts") {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center p-4 space-x-3">
              <motion.div
                {...animationProps}
                className={`w-10 h-10 rounded-full ${shimmerStyle}`}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  {...animationProps}
                  className={`h-3 w-3/4 rounded ${shimmerStyle}`}
                />
                <motion.div
                  {...animationProps}
                  className={`h-2 w-1/2 rounded ${shimmerStyle}`}
                />
              </div>
            </div>

            {/* Content */}
            <motion.div
              {...animationProps}
              className={`aspect-square w-full ${shimmerStyle}`}
            />

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex space-x-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <motion.div
                    key={j}
                    {...animationProps}
                    className={`w-7 h-7 rounded ${shimmerStyle}`}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <motion.div
                  {...animationProps}
                  className={`h-3 w-1/4 rounded ${shimmerStyle}`}
                />
                <motion.div
                  {...animationProps}
                  className={`h-3 w-3/4 rounded ${shimmerStyle}`}
                />
                <motion.div
                  {...animationProps}
                  className={`h-3 w-2/3 rounded ${shimmerStyle}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "suggestions") {
    return (
      <div className={`space-y-4 ${className}`}>
        <motion.div
          {...animationProps}
          className={`h-6 w-2/3 rounded ${shimmerStyle}`}
        />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                {...animationProps}
                className={`w-10 h-10 rounded-full ${shimmerStyle}`}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  {...animationProps}
                  className={`h-3 w-3/4 rounded ${shimmerStyle}`}
                />
                <motion.div
                  {...animationProps}
                  className={`h-2 w-1/2 rounded ${shimmerStyle}`}
                />
              </div>
            </div>
            <motion.div
              {...animationProps}
              className={`h-8 w-16 rounded-md ${shimmerStyle}`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "follow-requests") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <motion.div
            {...animationProps}
            className={`h-8 w-48 rounded-lg ${shimmerStyle}`}
          />
          <motion.div
            {...animationProps}
            className={`h-6 w-20 rounded-md ${shimmerStyle}`}
          />
        </div>

        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  {...animationProps}
                  className={`w-12 h-12 rounded-full ${shimmerStyle}`}
                />
                <div className="space-y-2">
                  <motion.div
                    {...animationProps}
                    className={`h-4 w-32 rounded ${shimmerStyle}`}
                  />
                  <motion.div
                    {...animationProps}
                    className={`h-3 w-24 rounded ${shimmerStyle}`}
                  />
                  <motion.div
                    {...animationProps}
                    className={`h-2 w-20 rounded ${shimmerStyle}`}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.div
                  {...animationProps}
                  className={`h-9 w-20 rounded-md ${shimmerStyle}`}
                />
                <motion.div
                  {...animationProps}
                  className={`h-9 w-20 rounded-md ${shimmerStyle}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
