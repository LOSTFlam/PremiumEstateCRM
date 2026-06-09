import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

const activityIcons = {
  deal_stage: "🔄",
  new_lead: "👤",
  property_viewed: "🏠",
  meeting_scheduled: "📅",
  call_logged: "📞",
  email_sent: "📧",
  deal_won: "🎉",
  deal_lost: "❌",
};

export function ActivityFeed({ limit = 20 }) {
  const [activities, setActivities] = useState([]);
  const ws = useWebSocket();

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "activity") {
        setActivities((prev) => [message.data, ...prev].slice(0, limit));
      }
    };
  }, [ws, limit]);

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-6">
      <Heading size="lg" className="mb-4">
        Activity Stream
      </Heading>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence initial={false}>
          {activities.map((activity, _i) => (
            <motion.div
              key={`${activity.id}-${activity.timestamp}`}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <span className="text-xl">{activityIcons[activity.type] || "📌"}</span>
              <div className="flex-1 min-w-0">
                <Text size="sm">{activity.description}</Text>
                <Text size="xs" className="text-[var(--text-tertiary)]">
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {activities.length === 0 && (
          <Text size="sm" className="text-[var(--text-tertiary)] text-center py-8">
            No recent activity
          </Text>
        )}
      </div>
    </div>
  );
}
