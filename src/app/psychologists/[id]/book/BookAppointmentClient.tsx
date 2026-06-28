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
      <BookAppointmentForm
        psychologistId={psychologistId}
        onBooked={(appointmentId) => {
          router.push(`/appointments/${appointmentId}/payment`);
        }}
      />
    </Card>
  );
}
