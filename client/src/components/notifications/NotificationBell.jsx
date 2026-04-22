import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi, putApi } from "../../services/api";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getApi("/api/notifications?limit=10"),
    refetchInterval: 30000,
  });

  const markRead = useMutation({
    mutationFn: (id) => putApi(`/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const unread = data?.data?.filter((n) => !n.read).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--danger)] text-white text-xs rounded-full flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50"
            >
              <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
                <Heading size="md">Notifications</Heading>
                {unread > 0 && (
                  <Text
                    size="xs"
                    className="text-[var(--accent)] cursor-pointer"
                    onClick={() => markRead.mutate("all")}
                  >
                    Mark all read
                  </Text>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {data?.data?.map((n) => (
                  <motion.button
                    key={n._id}
                    onClick={() => markRead.mutate(n._id)}
                    className={`w-full text-left p-3 border-b border-[var(--card-border)] hover:bg-[var(--bg-secondary)] transition-colors ${
                      !n.read ? "bg-[var(--accent-muted)]/30" : ""
                    }`}
                  >
                    <Text weight="medium" size="sm">
                      {n.title}
                    </Text>
                    <Text size="xs" className="text-[var(--text-tertiary)]">
                      {n.message}
                    </Text>
                    <Text size="xs" className="text-[var(--text-tertiary)] mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </Text>
                  </motion.button>
                ))}
                {data?.data?.length === 0 && (
                  <div className="p-6 text-center">
                    <Text size="sm" className="text-[var(--text-tertiary)]">
                      No notifications
                    </Text>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
