/**
 * Calendário do psicólogo — mostra horários livres e consultas com nome do paciente.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalendarSlot } from "@/domain/scheduling";
import { daysInMonthView } from "@/lib/calendar-utils";
import { SchedulingCalendar, useCalendarMonth } from "./SchedulingCalendar";

export function PsychologistCalendarPanel() {
  const [month, setMonth] = useCalendarMonth();
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const from = month.toISOString();
      const days = daysInMonthView(month);
      const res = await fetch(
        `/api/psychologists/me/calendar?from=${encodeURIComponent(from)}&days=${days}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao carregar calendário");
        setSlots([]);
        return;
      }
      setSlots(data.slots ?? []);
    } catch {
      setError("Erro de conexão");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Calendário de consultas</h2>
          <p className="card-subtitle">
            Horários livres e consultas agendadas — atualizado automaticamente pelo sistema
          </p>
        </div>
      </div>
      <div className="card-body">
        {error && <p className="calendar-error">{error}</p>}
        <SchedulingCalendar
          mode="view"
          slots={slots}
          month={month}
          onMonthChange={setMonth}
          loading={loading}
        />
      </div>
    </div>
  );
}
