import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  type: "stories" | "posts" | "suggestions";
  count?: number;
}

export default function LoadingSkeleton({
  type,
  count = 5,
}: LoadingSkeletonProps) {
  // Shimmer animation (di chuyển gradient ngang qua)
  const shimmer = {
    initial: { backgroundPosition: "-200% 0" },
    animate: { backgroundPosition: "200% 0" },
  };

  const shimmerStyle =
    "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  if (type === "stories") {
    return (
      <div className="flex gap-4 overflow-x-hidden py-4 px-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            variants={shimmer}
            initial="initial"
            animate="animate"
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 rounded-full ${shimmerStyle}`}
          />
        ))}
      </div>
    );
  }

  if (type === "posts") {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-lg overflow-hidden shadow-sm border"
          >
            {/* Header */}
            <div className="flex items-center p-3 space-x-3">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`w-10 h-10 rounded-full ${shimmerStyle}`}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`h-3 w-3/4 rounded ${shimmerStyle}`}
                />
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`h-2 w-1/2 rounded ${shimmerStyle}`}
                />
              </div>
            </div>

            {/* Content */}
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`aspect-square ${shimmerStyle}`}
            />

            {/* Actions */}
            <div className="p-3 space-y-2">
              <div className="flex space-x-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <motion.div
                    key={j}
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-6 h-6 rounded ${shimmerStyle}`}
                  />
                ))}
              </div>
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`h-3 w-1/4 rounded ${shimmerStyle}`}
              />
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`h-3 w-3/4 rounded ${shimmerStyle}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "suggestions") {
    return (
      <div className="space-y-4">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`h-8 w-2/3 rounded ${shimmerStyle}`}
        />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`w-8 h-8 rounded-full ${shimmerStyle}`}
            />
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={`h-4 flex-1 rounded ${shimmerStyle}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
