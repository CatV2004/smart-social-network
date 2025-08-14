import { motion, easeInOut } from "framer-motion";

interface LoadingSkeletonProps {
  type: "stories" | "posts" | "suggestions";
  count?: number;
}

export default function LoadingSkeleton({ type, count = 5 }: LoadingSkeletonProps) {
  const variants = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
  };

  const transition = {
    duration: 0.8,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: easeInOut,
  };

  if (type === "stories") {
    return (
      <div className="flex gap-4 overflow-x-hidden py-4 px-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="animate"
            variants={variants}
            transition={transition}
            className="w-16 h-16 rounded-full bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (type === "posts") {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="animate"
            variants={variants}
            transition={transition}
            className="w-full aspect-square bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (type === "suggestions") {
    return (
      <div className="space-y-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={variants}
          transition={transition}
          className="h-8 w-2/3 bg-gray-200 rounded"
        />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <motion.div
              initial="initial"
              animate="animate"
              variants={variants}
              transition={transition}
              className="w-8 h-8 rounded-full bg-gray-200"
            />
            <motion.div
              initial="initial"
              animate="animate"
              variants={variants}
              transition={transition}
              className="h-4 flex-1 bg-gray-200 rounded"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
