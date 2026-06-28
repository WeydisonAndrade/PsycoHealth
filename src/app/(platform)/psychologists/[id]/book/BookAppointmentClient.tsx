/**
 * Wrapper cliente para o fluxo de agendamento.
 * Necessário porque usa hooks de navegação e callbacks pós-agendamento.
 */
"use client";

import { useRouter } from "next/navigation";
import { BookAppointmentForm } from "@/components/scheduling/BookAppointmentForm";
import { Card } from "@/components/ui/Card";

interface Props {
  psychologistId: string;
}

export function BookAppointmentClient({ psychologistId }: Props) {
  const router = useRouter();

  return (
    <Card>
      {/* Após criar o agendamento, redireciona para a página de pagamento */}
      <BookAppointmentForm
        psychologistId={psychologistId}
        onBooked={(appointmentId) => {
          router.push(`/appointments/${appointmentId}/payment`);
        }}
      />
    </Card>
  );
}
