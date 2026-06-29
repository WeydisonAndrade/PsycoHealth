/**
 * Calendário mensal reutilizável para agendamento e visualização de consultas.
 */
"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent, CalendarSlot } from "@/domain/scheduling";
import {
  WEEKDAY_LABELS,
  addMonths,
  formatDayLabel,
  formatMonthYear,
  formatTime,
  getMonthGrid,
  groupEventsByDay,
  groupSlotsByDay,
  startOfMonth,
  toLocalDateKey,
} from "@/lib/calendar-utils";
import { Button } from "@/components/ui/Button";

interface SchedulingCalendarProps {
  slots?: CalendarSlot[];
  events?: CalendarEvent[];
  mode: "view" | "select";
  selectedDatetime?: string;
  onSelectDatetime?: (datetime: string) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  loading?: boolean;
}

export function SchedulingCalendar({
  slots = [],
  events = [],
  mode,
  selectedDatetime,
  onSelectDatetime,
  month,
  onMonthChange,
  loading = false,
}: SchedulingCalendarProps) {
  const grid = useMemo(() => getMonthGrid(month), [month]);
  const slotsByDay = useMemo(() => groupSlotsByDay(slots), [slots]);
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  const todayKey = toLocalDateKey(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(todayKey);

  const daySlots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : [];
  const dayEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : [];

  function handleDayClick(dateKey: string | null) {
    if (!dateKey) return;
    setSelectedDay(dateKey);
  }

  function dayIndicators(dateKey: string | null) {
    if (!dateKey) return null;
    const daySlotList = slotsByDay.get(dateKey) ?? [];
    const dayEventList = eventsByDay.get(dateKey) ?? [];
    const hasAvailable = daySlotList.some((s) => s.available);
    const hasBooked = daySlotList.some((s) => !s.available);
    const hasEvents = dayEventList.length > 0;

    if (!hasAvailable && !hasBooked && !hasEvents) return null;

    return (
      <div className="calendar-day-dots" aria-hidden="true">
        {hasAvailable && <span className="calendar-dot calendar-dot--available" />}
        {hasBooked && <span className="calendar-dot calendar-dot--booked" />}
        {hasEvents && <span className="calendar-dot calendar-dot--event" />}
      </div>
    );
  }

  return (
    <div className="scheduling-calendar">
      <div className="calendar-header">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(addMonths(month, -1))}
          aria-label="Mês anterior"
        >
          ←
        </Button>
        <h3 className="calendar-month-title">{formatMonthYear(month)}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="Próximo mês"
        >
          →
        </Button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="calendar-weekday">
            {label}
          </span>
        ))}
      </div>

      {loading ? (
        <p className="calendar-loading">Carregando calendário...</p>
      ) : (
        <div className="calendar-grid" role="grid" aria-label="Calendário mensal">
          {grid.map((cell, index) => {
            const isSelected = cell.dateKey === selectedDay;
            return (
              <button
                key={`${cell.dateKey ?? "empty"}-${index}`}
                type="button"
                className={[
                  "calendar-day",
                  !cell.isCurrentMonth && "calendar-day--muted",
                  cell.isToday && "calendar-day--today",
                  isSelected && "calendar-day--selected",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleDayClick(cell.dateKey)}
                disabled={!cell.dateKey}
                aria-pressed={isSelected}
                aria-label={
                  cell.dateKey
                    ? new Date(cell.date!).toLocaleDateString("pt-BR")
                    : undefined
                }
              >
                <span className="calendar-day-number">
                  {cell.date ? cell.date.getDate() : ""}
                </span>
                {dayIndicators(cell.dateKey)}
              </button>
            );
          })}
        </div>
      )}

      <div className="calendar-legend">
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--available" /> Disponível
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--booked" /> Ocupado
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--event" /> Sua consulta
        </span>
      </div>

      {selectedDay && (
        <div className="calendar-day-panel">
          <h4 className="calendar-day-panel-title">{formatDayLabel(selectedDay)}</h4>

          {dayEvents.length > 0 && (
            <div className="calendar-day-section">
              <p className="calendar-day-section-label">Consultas agendadas</p>
              <ul className="calendar-time-list">
                {dayEvents.map((event) => (
                  <li key={event.appointmentId} className="calendar-time-item calendar-time-item--event">
                    <span className="calendar-time">{formatTime(event.datetime)}</span>
                    <span className="calendar-time-label">{event.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {daySlots.length > 0 && (
            <div className="calendar-day-section">
              <p className="calendar-day-section-label">
                {mode === "select" ? "Horários do psicólogo" : "Agenda do dia"}
              </p>
              <div className="slots-grid">
                {daySlots.map((slot) => {
                  const isSelected = selectedDatetime === slot.datetime;
                  const canSelect = mode === "select" && slot.available;

                  return (
                    <button
                      key={slot.datetime}
                      type="button"
                      className={[
                        "slot-btn",
                        isSelected && "selected",
                        !slot.available && "slot-btn--booked",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={!canSelect}
                      onClick={() => canSelect && onSelectDatetime?.(slot.datetime)}
                      title={slot.label}
                    >
                      <span className="slot-btn-time">{formatTime(slot.datetime)}</span>
                      {!slot.available && (
                        <span className="slot-btn-status">{slot.label ?? "Ocupado"}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dayEvents.length === 0 && daySlots.length === 0 && (
            <p className="calendar-empty-day">Nenhum horário ou consulta neste dia.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function useCalendarMonth(initial = new Date()) {
  return useState(() => startOfMonth(initial));
}
