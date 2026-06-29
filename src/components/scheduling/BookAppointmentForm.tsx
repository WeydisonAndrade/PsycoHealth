/**
 * Seletor de horários e formulário de agendamento com calendário mensal.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalendarSlot } from "@/domain/scheduling";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { daysInMonthView } from "@/lib/calendar-utils";
import { SchedulingCalendar, useCalendarMonth } from "./SchedulingCalendar";

interface SlotPickerProps {
  psychologistId: string;
  onSelect: (datetime: string) => void;
  selected?: string;
}

/** Calendário com horários livres e ocupados do psicólogo */
export function SlotPicker({ psychologistId, onSelect, selected }: SlotPickerProps) {
  const [month, setMonth] = useCalendarMonth();
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const from = month.toISOString();
      const days = daysInMonthView(month);
      const res = await fetch(
        `/api/psychologists/${psychologistId}/slots?from=${encodeURIComponent(from)}&days=${days}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao carregar horários");
        setSlots([]);
        return;
      }
      setSlots(data.slots ?? []);
    } catch {
      setError("Erro ao carregar horários");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [psychologistId, month]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!loading && slots.length === 0) {
    return <Alert type="info">Nenhum horário disponível neste período</Alert>;
  }

  return (
    <SchedulingCalendar
      mode="select"
      slots={slots}
      selectedDatetime={selected}
      onSelectDatetime={onSelect}
      month={month}
      onMonthChange={setMonth}
      loading={loading}
    />
  );
}

interface BookAppointmentFormProps {
  psychologistId: string;
  onBooked: (appointmentId: string) => void;
}

export function BookAppointmentForm({ psychologistId, onBooked }: BookAppointmentFormProps) {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBook() {
    if (!selected) {
      setError("Selecione um horário disponível");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ psychologistId, scheduledAt: selected }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao agendar");
        return;
      }

      onBooked(data.appointment.id);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <Alert type="error">{error}</Alert>}
      <SlotPicker psychologistId={psychologistId} onSelect={setSelected} selected={selected} />
      <Button className="mt-2" onClick={handleBook} disabled={loading || !selected}>
        {loading ? "Agendando..." : "Confirmar horário"}
      </Button>
    </div>
  );
}
