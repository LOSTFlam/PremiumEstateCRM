import { motion } from "framer-motion";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

const kpiConfig = [
  {
    label: "Total Revenue",
    key: "revenue",
    format: (v) => `$${v.toLocaleString()}`,
    trend: "up",
    color: "var(--success)",
  },
  {
    label: "Active Deals",
    key: "activeDeals",
    format: (v) => v,
    trend: "up",
    color: "var(--accent)",
  },
  {
    label: "Conversion Rate",
    key: "conversionRate",
    format: (v) => `${v}%`,
    trend: "neutral",
    color: "var(--warning)",
  },
  {
    label: "Avg Deal Time",
    key: "avgDealTime",
    format: (v) => `${v} days`,
    trend: "down",
    color: "var(--purple)",
  },
];

export function KPICards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((kpi, i) => (
        <motion.div
          key={kpi.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -2, boxShadow: "var(--shadow-lg)" }}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-5"
        >
          <Text size="sm" className="text-[var(--text-tertiary)] mb-1">
            {kpi.label}
          </Text>
          <Heading size="2xl" style={{ color: kpi.color }}>
            {kpi.format(data?.[kpi.key] ?? 0)}
          </Heading>
          <div className="flex items-center gap-1 mt-2">
            <span style={{ color: kpi.color }}>
              {kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "→"}
            </span>
            <Text size="xs" className="text-[var(--text-tertiary)]">
              vs last month
            </Text>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
