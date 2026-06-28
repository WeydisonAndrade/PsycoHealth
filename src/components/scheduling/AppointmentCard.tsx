import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge, statusToBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatCurrency } from "@/lib/utils";

interface AppointmentCardProps {
  id: string;
  scheduledAt: string | Date;
  status: string;
  psychologistName?: string;
  patientName?: string;
  paymentStatus?: string;
  sessionPrice?: number;
  role: "PATIENT" | "PSYCHOLOGIST";
}

export function AppointmentCard({
  id,
  scheduledAt,
  status,
  psychologistName,
  patientName,
  paymentStatus,
  sessionPrice,
  role,
}: AppointmentCardProps) {
  const statusBadge = statusToBadge(status);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--gold)" }}>
            {formatDateTime(scheduledAt)}
          </p>
          {psychologistName && (
            <p style={{ color: "var(--text-muted)" }}>Psicólogo: {psychologistName}</p>
          )}
          {patientName && (
            <p style={{ color: "var(--text-muted)" }}>Paciente: {patientName}</p>
          )}
          {sessionPrice !== undefined && (
            <p style={{ color: "var(--text-muted)" }}>{formatCurrency(sessionPrice)}</p>
          )}
        </div>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>

      <div className="mt-2" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {role === "PATIENT" && status === "PENDING_PAYMENT" && (
          <Link href={`/appointments/${id}/payment`}>
            <Button size="sm">Pagar consulta</Button>
          </Link>
        )}
        {(status === "CONFIRMED" || status === "IN_PROGRESS") && (
          <Link href={`/session/${id}`}>
            <Button size="sm" variant="secondary">
              Entrar na videochamada
            </Button>
          </Link>
        )}
        {paymentStatus === "PAID" && status === "CONFIRMED" && (
          <Badge variant="success">Pagamento confirmado</Badge>
        )}
      </div>
    </Card>
  );
}
