import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanbanCard } from "./KanbanCard";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

export function KanbanColumn({ stage, deals, onDrop }) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const dealId = e.dataTransfer.getData("dealId");
    onDrop?.(dealId, stage._id);
  };

  const totalValue = deals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-72 bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] p-3"
      style={{ border: isOver ? `2px dashed var(--accent)` : "2px solid transparent" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color || "var(--accent)" }}
          />
          <Heading size="sm">{stage.name}</Heading>
          <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
      </div>

      {totalValue > 0 && (
        <Text size="xs" className="text-[var(--text-tertiary)] mb-3">
          ${totalValue.toLocaleString()}
        </Text>
      )}

      <AnimatePresence>
        <div className="space-y-2 min-h-[100px]">
          {deals.map((deal) => (
            <KanbanCard
              key={deal._id}
              deal={deal}
              onDragStart={(e) => e.dataTransfer.setData("dealId", deal._id)}
            />
          ))}
        </div>
      </AnimatePresence>

      {deals.length === 0 && (
        <div className="flex items-center justify-center h-24 text-[var(--text-tertiary)] text-sm">
          Drop deals here
        </div>
      )}
    </motion.div>
  );
}
