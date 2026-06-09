import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getApi } from "../../services/api";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

const typeIcons = {
  call: "📞",
  meeting: "📅",
  lunch: "🍽️",
  note: "📝",
  email: "📧",
  file: "📎",
  stage_change: "🔄",
  deal_stage: "🔄",
  new_lead: "👤",
  property_viewed: "🏠",
  quote_created: "📄",
  email_sent: "📧",
  task: "✅",
};

const typeLabels = {
  call: "Call",
  meeting: "Meeting",
  lunch: "Lunch",
  note: "Note",
  email: "Email",
  file: "File",
  stage_change: "Stage Change",
  deal_stage: "Stage Change",
  new_lead: "New Lead",
  property_viewed: "Property Viewed",
  quote_created: "Quote Created",
  email_sent: "Email Sent",
  task: "Task",
};

export function ClientTimeline({ contactId, leadId, limit = 50 }) {
  const { data, isLoading } = useQuery({
    queryKey: ["timeline", contactId, leadId],
    queryFn: () => {
      const params = new URLSearchParams();
      if (contactId) params.set("contactId", contactId);
      if (leadId) params.set("leadId", leadId);
      if (limit) params.set("limit", limit);
      return getApi(`/api/pipeline/workflows?${params}`);
    },
    enabled: !!(contactId || leadId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  const activities =
    data?.data
      ?.flatMap((wf) =>
        (wf.activities || []).map((a) => ({
          ...a,
          workflowId: wf._id,
          leadName: wf.lead?.name,
        }))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-6">
      <Heading size="lg" className="mb-4">
        Activity Timeline
      </Heading>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--card-border)]" />
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.map((activity, i) => (
              <motion.div
                key={`${activity._id}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative flex gap-4 pl-8"
              >
                <div className="absolute left-0 w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-sm z-10">
                  {typeIcons[activity.type] || "📌"}
                </div>
                <div className="flex-1 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] p-3 border border-[var(--card-border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Text weight="medium" size="sm">
                      {typeLabels[activity.type] || activity.type}
                    </Text>
                    {activity.leadName && (
                      <Text size="xs" className="text-[var(--text-tertiary)]">
                        · {activity.leadName}
                      </Text>
                    )}
                  </div>
                  <Text size="sm">{activity.description}</Text>
                  <Text size="xs" className="text-[var(--text-tertiary)] mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </Text>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activities.length === 0 && (
            <Text size="sm" className="text-[var(--text-tertiary)] text-center py-8">
              No activities recorded yet
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
