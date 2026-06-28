/**
 * Etiqueta colorida para exibir status (consultas, pagamentos, etc.).
 * Usado em AppointmentCard e exporta statusToBadge para mapear enums da API.
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

/** Mapeamento de variantes para classes CSS (.badge-success, .badge-warning, etc.) */
const variants = {
  default: "badge-default",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  /* --- Renderização --- */
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
}

/** Converte status da API (PENDING_PAYMENT, CONFIRMED, etc.) em label e variante visual */
export function statusToBadge(status: string): { label: string; variant: BadgeProps["variant"] } {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    PENDING_PAYMENT: { label: "Aguardando pagamento", variant: "warning" },
    CONFIRMED: { label: "Confirmada", variant: "success" },
    IN_PROGRESS: { label: "Em andamento", variant: "default" },
    COMPLETED: { label: "Concluída", variant: "success" },
    CANCELLED: { label: "Cancelada", variant: "danger" },
    PENDING: { label: "Pendente", variant: "warning" },
    PAID: { label: "Pago", variant: "success" },
    FAILED: { label: "Falhou", variant: "danger" },
  };
  return map[status] ?? { label: status, variant: "default" };
}
