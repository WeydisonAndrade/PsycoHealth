/**
 * Calendário do paciente — consultas próprias e disponibilidade por psicólogo.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CalendarEvent, CalendarSlot } from "@/domain/scheduling";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { daysInMonthView } from "@/lib/calendar-utils";
import { SchedulingCalendar, useCalendarMonth } from "./SchedulingCalendar";

interface PsychologistOption {
  id: string;
  user: { name: string };
}

export function PatientCalendarPanel() {
  const router = useRouter();
  const [appointmentsMonth, setAppointmentsMonth] = useCalendarMonth();
  const [availabilityMonth, setAvailabilityMonth] = useCalendarMonth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [psychologists, setPsychologists] = useState<PsychologistOption[]>([]);
  const [selectedPsychologistId, setSelectedPsychologistId] = useState("");
  const [selectedDatetime, setSelectedDatetime] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPsychologists() {
      try {
        const res = await fetch("/api/psychologists");
        const data = await res.json();
        const list: PsychologistOption[] = data.psychologists ?? [];
        setPsychologists(list);
        if (list.length > 0) {
          setSelectedPsychologistId((current) => current || list[0].id);
        }
      } catch {
        setError("Erro ao carregar psicólogos");
      }
    }
    loadPsychologists();
  }, []);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const from = appointmentsMonth.toISOString();
      const days = daysInMonthView(appointmentsMonth);
      const res = await fetch(
        `/api/patients/me/calendar?from=${encodeURIComponent(from)}&days=${days}`
      );
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events ?? []);
      }
    } catch {
      /* silencioso — seção secundária */
    } finally {
      setLoadingEvents(false);
    }
  }, [appointmentsMonth]);

  const loadSlots = useCallback(async () => {
    if (!selectedPsychologistId) return;
    setLoadingSlots(true);
    setSelectedDatetime("");
    try {
      const from = availabilityMonth.toISOString();
      const days = daysInMonthView(availabilityMonth);
      const res = await fetch(
        `/api/psychologists/${selectedPsychologistId}/slots?from=${encodeURIComponent(from)}&days=${days}`
      );
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedPsychologistId, availabilityMonth]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  async function handleBook() {
    if (!selectedPsychologistId || !selectedDatetime) {
      setError("Selecione um horário disponível");
      return;
    }

    setError("");
    setBooking(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psychologistId: selectedPsychologistId,
          scheduledAt: selectedDatetime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao agendar");
        await loadSlots();
        return;
      }
      router.push(`/appointments/${data.appointment.id}/payment`);
    } catch {
      setError("Erro de conexão");
    } finally {
      setBooking(false);
    }
  }

  const selectedPsychologist = psychologists.find((p) => p.id === selectedPsychologistId);

  return (
    <div className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Minhas consultas</h2>
            <p className="card-subtitle">Datas e horários das suas sessões agendadas</p>
          </div>
        </div>
        <div className="card-body">
          <SchedulingCalendar
            mode="view"
            events={events}
            month={appointmentsMonth}
            onMonthChange={setAppointmentsMonth}
            loading={loadingEvents}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Agendar nova consulta</h2>
            <p className="card-subtitle">
              Escolha um psicólogo e veja horários livres — ocupados aparecem indisponíveis
            </p>
          </div>
        </div>
        <div className="card-body">
          {error && (
            <div className="mb-2">
              <Alert type="error">{error}</Alert>
            </div>
          )}

          <div className="form-group mb-2">
            <label className="label" htmlFor="psychologist-select">
              Psicólogo
            </label>
            <select
              id="psychologist-select"
              className="input"
              value={selectedPsychologistId}
              onChange={(e) => setSelectedPsychologistId(e.target.value)}
            >
            {psychologists.length === 0 && (
              <option value="">Nenhum psicólogo disponível</option>
            )}
            {psychologists.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.name}
              </option>
            ))}
            </select>
          </div>

          {selectedPsychologist && (
            <p className="calendar-psychologist-hint mb-2">
              Disponibilidade de <strong>{selectedPsychologist.user.name}</strong>
            </p>
          )}

          <SchedulingCalendar
            mode="select"
            slots={slots}
            selectedDatetime={selectedDatetime}
            onSelectDatetime={setSelectedDatetime}
            month={availabilityMonth}
            onMonthChange={setAvailabilityMonth}
            loading={loadingSlots}
          />

          <Button
            className="mt-2"
            onClick={handleBook}
            disabled={booking || !selectedDatetime}
            fullWidth
          >
            {booking ? "Agendando..." : "Confirmar horário selecionado"}
          </Button>
        </div>
      </div>
    </div>
  );
}
