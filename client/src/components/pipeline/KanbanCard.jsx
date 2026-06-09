import { motion } from "framer-motion";
import { Text } from "../typography/Text";

export function KanbanCard({ deal, onDragStart, onDragEnd }) {
  const probabilityColor =
    deal.dealProbability >= 70
      ? "var(--success)"
      : deal.dealProbability >= 40
        ? "var(--warning)"
        : "var(--text-tertiary)";

  return (
    <motion.div
      layout
      dragSnapsToOrigin
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
      whileTap={{ scale: 0.98 }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] p-3 cursor-grab active:cursor-grabbing transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <Text weight="medium" size="sm" className="text-[var(--text-primary)]">
          {deal.lead?.name || "Unnamed Lead"}
        </Text>
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${probabilityColor}20`, color: probabilityColor }}
        >
          {deal.dealProbability}%
        </span>
      </div>
      {deal.property && (
        <Text size="xs" className="text-[var(--text-tertiary)] mb-2">
          {deal.property.title || "Property"}
        </Text>
      )}
      {deal.dealValue && (
        <Text size="xs" weight="medium" className="text-[var(--success)]">
          ${deal.dealValue.toLocaleString()}
        </Text>
      )}
      {deal.nextFollowUp && (
        <Text size="xs" className="text-[var(--text-tertiary)] mt-1">
          Follow up: {new Date(deal.nextFollowUp).toLocaleDateString()}
        </Text>
      )}
    </motion.div>
  );
}
