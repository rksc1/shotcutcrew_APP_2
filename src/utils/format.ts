import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

// ─── Currency ────────────────────────────────────────────────────────────────
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "₹—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyCompact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "₹—";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

// ─── Dates ───────────────────────────────────────────────────────────────────
export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return dayjs(date).format("DD MMM YYYY");
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "—";
  return dayjs(date).format("DD MMM YYYY, h:mm A");
}

export function formatRelative(date: string | null | undefined): string {
  if (!date) return "—";
  return dayjs(date).fromNow();
}

export function formatEventDate(date: string | null | undefined): string {
  if (!date) return "Date TBD";
  return dayjs(date).format("ddd, DD MMM YYYY");
}

// ─── Text ────────────────────────────────────────────────────────────────────
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function initials(name: string | null | undefined): string {
  if (!name) return "SC";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function slugToTitle(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Ratings ─────────────────────────────────────────────────────────────────
export function formatRating(rating: number | null | undefined): string {
  if (!rating) return "New";
  return rating.toFixed(1);
}

// ─── Status ──────────────────────────────────────────────────────────────────
export function paymentStatusLabel(status: string | null | undefined): string {
  const labels: Record<string, string> = {
    not_required:     "Not Required",
    pending_payment:  "Payment Pending",
    qr_pending:       "QR Payment Pending",
    proof_uploaded:   "Proof Under Review",
    payment_received: "Payment Verified",
    paid:             "Paid",
    rejected:         "Payment Rejected",
  };
  return labels[status ?? ""] ?? (status ?? "Unknown");
}
