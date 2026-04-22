import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../../services/api";
import { Heading as _Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

const typeIcons = {
  lead: "👤",
  contact: "📇",
  property: "🏠",
  quote: "📄",
  invoice: "💰",
  pipeline: "🔄",
  user: "👥",
  task: "✅",
  meeting: "📅",
  document: "📎",
};

export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["smart-search", query],
    queryFn: () => getApi(`/api/property?search=${query}&limit=10`),
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const handleInput = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setOpen(value.length >= 2);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {}, 300);
  }, []);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search leads, contacts, properties..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
        />

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
          🔍
        </span>
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute top-full mt-2 w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] z-50 max-h-80 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 space-y-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-10 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                  ))}
              </div>
            ) : data?.data?.length > 0 ? (
              <div className="p-2">
                <Text size="xs" className="text-[var(--text-tertiary)] px-2 py-1">
                  {data.data.length} results
                </Text>
                {data.data.map((item, i) => (
                  <motion.button
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-colors text-left"
                  >
                    <span className="text-lg">{typeIcons[item.type] || "📌"}</span>
                    <div className="flex-1 min-w-0">
                      <Text weight="medium" size="sm" className="truncate">
                        {item.title || item.name || "Untitled"}
                      </Text>
                      <Text size="xs" className="text-[var(--text-tertiary)] truncate">
                        {item.location || item.email || ""}
                      </Text>
                    </div>
                    {item.price && (
                      <Text size="sm" weight="semibold" style={{ color: "var(--success)" }}>
                        ${item.price.toLocaleString()}
                      </Text>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Text size="sm" className="text-[var(--text-tertiary)]">
                  No results for &quot;{query}&quot;
                </Text>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
