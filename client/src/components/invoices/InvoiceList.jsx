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
  partially_paid: "var(--warning)",
  paid: "var(--success)",
  overdue: "var(--danger)",
  cancelled: "var(--text-tertiary)",
};

export function InvoiceList() {
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getApi("/api/crm-invoices"),
  });

  const createInvoice = useMutation({
    mutationFn: (data) => postApi("/api/crm-invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      setShowForm(false);
    },
  });

  const sendInvoice = useMutation({
    mutationFn: (id) => putApi(`/api/crm-invoices/${id}/send`),
    onSuccess: () => queryClient.invalidateQueries(["invoices"]),
  });

  const recordPayment = useMutation({
    mutationFn: ({ id, data }) => postApi(`/api/crm-invoices/${id}/payment`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      setShowPayment(null);
    },
  });

  if (isLoading) return <SkeletonCard count={4} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading size="xl">Invoices</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Invoice"}
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
            <InvoiceForm
              onSubmit={(data) => createInvoice.mutate(data)}
              loading={createInvoice.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {data?.data?.map((inv) => (
          <motion.div
            key={inv._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-md)] p-4 flex items-center justify-between hover:border-[var(--card-border-hover)] transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <Text weight="medium">{inv.invoiceNumber}</Text>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${statusColors[inv.status]}20`,
                    color: statusColors[inv.status],
                  }}
                >
                  {inv.status.replace("_", " ")}
                </span>
              </div>
              <Text size="sm" className="text-[var(--text-tertiary)]">
                {inv.contact?.name || inv.lead?.name}
              </Text>
              <Text size="xs" className="text-[var(--text-tertiary)]">
                Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A"}
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Text weight="semibold" style={{ color: "var(--success)" }}>
                  ${inv.grandTotal?.toLocaleString() || 0}
                </Text>
                {inv.amountDue > 0 && (
                  <Text size="xs" className="text-[var(--danger)]">
                    Due: ${inv.amountDue?.toLocaleString()}
                  </Text>
                )}
              </div>
              {inv.status === "draft" && (
                <Button size="sm" variant="secondary" onClick={() => sendInvoice.mutate(inv._id)}>
                  Send
                </Button>
              )}
              {inv.status !== "paid" && inv.status !== "cancelled" && (
                <Button size="sm" variant="success" onClick={() => setShowPayment(inv._id)}>
                  Pay
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        {data?.data?.length === 0 && (
          <Text className="text-center py-8 text-[var(--text-tertiary)]">No invoices yet</Text>
        )}
      </div>

      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-xl)] p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <Heading size="lg" className="mb-4">
                Record Payment
              </Heading>
              <PaymentForm
                invoiceId={showPayment}
                onSubmit={(data) => recordPayment.mutate({ id: showPayment, data })}
                loading={recordPayment.isPending}
                onCancel={() => setShowPayment(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InvoiceForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    contact: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    dueDate: "",
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
          placeholder="Contact ID"
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
        />

        <input
          type="date"
          className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
          value={form.dueDate}
          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
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
          Create Invoice
        </Button>
      </div>
    </div>
  );
}

function PaymentForm({ invoiceId: _invoiceId, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({
    amount: 0,
    method: "bank_transfer",
    reference: "",
    notes: "",
  });

  return (
    <div className="space-y-3">
      <input
        type="number"
        className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) }))}
      />

      <select
        className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
        value={form.method}
        onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
      >
        <option value="bank_transfer">Bank Transfer</option>
        <option value="cash">Cash</option>
        <option value="check">Check</option>
        <option value="credit_card">Credit Card</option>
        <option value="stripe">Stripe</option>
      </select>
      <input
        className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
        placeholder="Reference"
        value={form.reference}
        onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
      />

      <textarea
        className="w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-primary)]"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
      />

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" variant="success" loading={loading} onClick={() => onSubmit(form)}>
          Record Payment
        </Button>
      </div>
    </div>
  );
}
