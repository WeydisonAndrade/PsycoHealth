/**
 * Resumo de ganhos e histórico de repasses do psicólogo.
 * Usado em src/app/dashboard/psychologist/page.tsx; recebe dados calculados no servidor.
 */
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface EarningsSummaryProps {
  totalEarnings: number;
  totalSessions: number;
  payments: {
    id: string;
    psychologistPayout: number;
    platformCommission: number;
    totalAmount: number;
    paidAt: Date | string | null;
    appointment: {
      scheduledAt: Date | string;
      patient: { user: { name: string } };
    };
  }[];
}

export function EarningsSummary({ totalEarnings, totalSessions, payments }: EarningsSummaryProps) {
  /* --- Renderização --- */
  return (
    <div>
      <div className="grid-2 mb-3">
        <Card title="Total recebido">
          <p className="earnings-price">{formatCurrency(totalEarnings)}</p>
        </Card>
        <Card title="Consultas pagas">
          <p className="earnings-price">{totalSessions}</p>
        </Card>
      </div>

      <Card title="Histórico de repasses">
        {payments.length === 0 ? (
          <p className="empty-state">Nenhum pagamento recebido ainda</p>
        ) : (
          payments.map((p) => (
            <div key={p.id} className="split-row">
              <span>
                {p.appointment.patient.user.name} — {formatDateTime(p.appointment.scheduledAt)}
              </span>
              <span>{formatCurrency(p.psychologistPayout)}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
