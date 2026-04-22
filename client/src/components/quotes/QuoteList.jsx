import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi, postApi, putApi } from "../../services/api";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";
import { Button } from "../ui/Button";
import { SkeletonCard } from "../skeletons/SkeletonCard";

const statusColors = {
  draft: "var(--text-tertiary)",
  sent: "var(--accent)",
  viewed: "var(--info)",
  accepted: "var(--success)",
  rejected: "var(--danger)",
  expired: "var(--warning)",
  converted: "var(--purple)",
};

export function QuoteList() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => getApi("/api/crm-quotes"),
  });

  const createQuote = useMutation({
    mutationFn: (data) => postApi("/api/crm-quotes", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["quotes"]);
      setShowForm(false);
    },
  });

  const sendQuote = useMutation({
    mutationFn: (id) => putApi(`/api/crm-quotes/${id}/send`),
    onSuccess: () => queryClient.invalidateQueries(["quotes"]),
  });

  if (isLoading) return <SkeletonCard count={4} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading size="xl">Quotes</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Quote"}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] p-4"
          >
            <QuoteForm
              onSubmit={(data) => createQuote.mutate(data)}
              loading={createQuote.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {data?.data?.map((quote) => (
          <motion.div
            key={quote._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] p-4 flex items-center justify-between hover:border-[var(--card-border-hover)] transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <Text weight="medium">{quote.quoteNumber}</Text>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${statusColors[quote.status]}20`,
                    color: statusColors[quote.status],
                  }}
                >
                  {quote.status}
                </span>
              </div>
              <Text size="sm" className="text-[var(--text-tertiary)]">
                {quote.subject}
              </Text>
              <Text size="xs" className="text-[var(--text-tertiary)]">
                {quote.contact?.name || quote.lead?.name} ·{" "}
                {new Date(quote.createdAt).toLocaleDateString()}
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Text weight="semibold" style={{ color: "var(--success)" }}>
                ${quote.grandTotal?.toLocaleString() || 0}
              </Text>
              {quote.status === "draft" && (
                <Button size="sm" variant="secondary" onClick={() => sendQuote.mutate(quote._id)}>
                  Send
                </Button>
              )}
              {quote.status === "accepted" && (
                <Button size="sm" variant="success">
                  Convert to Deal
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        {data?.data?.length === 0 && (
          <Text className="text-center py-8 text-[var(--text-tertiary)]">No quotes yet</Text>
        )}
      </div>
    </div>
  );
}

function QuoteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    subject: "",
    contact: "",
    lead: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    expiryDate: "",
  });

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { description: "", quantity: 1, unitPrice: 0 }] }));
  const updateItem = (i, field, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, j) => (j === i ? { ...item, [field]: value } : item)),
    }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        />
        <input
          type="date"
          className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
          value={form.expiryDate}
          onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
        />
      </div>
      {form.items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
          />
          <input
            type="number"
            className="w-20 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value))}
          />
          <input
            type="number"
            className="w-28 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
            placeholder="Price"
            value={item.unitPrice}
            onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value))}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={addItem}>
          + Item
        </Button>
        <Button size="sm" loading={loading} onClick={() => onSubmit(form)}>
          Create Quote
        </Button>
      </div>
    </div>
  );
}
