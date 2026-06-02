import { formatCurrencyFromCents } from "@/lib/saas-formatters";

export function formatFinanceCurrency(cents: number, compact = false) {
  if (!compact) {
    return formatCurrencyFromCents(cents);
  }

  const value = cents / 100;

  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }

  return formatCurrencyFromCents(cents);
}

const INVOICE_STATUS_LABELS: Record<string, string> = {
  PAID: "Pago",
  PENDING: "Pendente",
  OVERDUE: "Em atraso",
  FAILED: "Falhou",
  CANCELED: "Cancelado",
};

export function formatInvoiceStatus(status: string) {
  return INVOICE_STATUS_LABELS[status] ?? status;
}
