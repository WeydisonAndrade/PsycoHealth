/**
 * Card de consulta com status, participantes e ações (pagar ou entrar na videochamada).
 * Usado nos dashboards de paciente e psicólogo (src/app/dashboard/patient e psychologist).
 */
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

  /* --- Renderização --- */
  return (
    <Card>
      <div className="appointment-card-header">
        <div>
          <p className="appointment-card-datetime">{formatDateTime(scheduledAt)}</p>
          {psychologistName && (
            <p className="appointment-card-meta">Psicólogo: {psychologistName}</p>
          )}
          {patientName && (
            <p className="appointment-card-meta">Paciente: {patientName}</p>
          )}
          {sessionPrice !== undefined && (
            <p className="appointment-card-meta">{formatCurrency(sessionPrice)}</p>
          )}
        </div>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>

      <div className="mt-2 appointment-card-actions">
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
