import { motion } from "framer-motion";

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-1/2" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-5">
      <div className="space-y-3">
        <div className="h-6 bg-[var(--bg-tertiary)] rounded animate-pulse w-1/4" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse flex-1" />
            <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse flex-1" />
            <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-5"
        >
          <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse w-1/2 mb-2" />
          <div className="h-8 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
        </div>
      ))}
    </div>
  );
}
