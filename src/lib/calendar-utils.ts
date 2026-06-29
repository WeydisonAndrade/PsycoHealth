/**
 * Utilitários para montar grade mensal e agrupar horários por dia.
 */

import type { CalendarEvent, CalendarSlot } from "@/domain/scheduling";

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return startOfMonth(d);
}

export function toLocalDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(new Date(iso));
}

export function formatDayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export interface MonthDay {
  date: Date | null;
  dateKey: string | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/** Grade de 6 semanas para exibir o mês completo */
export function getMonthGrid(month: Date): MonthDay[] {
  const first = startOfMonth(month);
  const startPad = first.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(gridStart.getDate() - startPad);

  const todayKey = toLocalDateKey(new Date());
  const monthIndex = first.getMonth();
  const cells: MonthDay[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const dateKey = toLocalDateKey(date);
    cells.push({
      date,
      dateKey,
      isCurrentMonth: date.getMonth() === monthIndex,
      isToday: dateKey === todayKey,
    });
  }

  return cells;
}

export function groupSlotsByDay(slots: CalendarSlot[]): Map<string, CalendarSlot[]> {
  const map = new Map<string, CalendarSlot[]>();
  for (const slot of slots) {
    const key = toLocalDateKey(slot.datetime);
    const list = map.get(key) ?? [];
    list.push(slot);
    map.set(key, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.datetime.localeCompare(b.datetime));
  }
  return map;
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = toLocalDateKey(event.datetime);
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.datetime.localeCompare(b.datetime));
  }
  return map;
}

export function daysInMonthView(month: Date): number {
  return 42;
}

/** Primeiro dia (YYYY-MM-DD) com horários ou consultas no mês exibido */
export function findFirstHighlightedDay(
  month: Date,
  slotsByDay: Map<string, CalendarSlot[]>,
  eventsByDay: Map<string, CalendarEvent[]>,
  mode: "view" | "select"
): string | null {
  const gridKeys = getMonthGrid(month)
    .map((cell) => cell.dateKey)
    .filter((key): key is string => Boolean(key));

  for (const key of gridKeys) {
    const daySlots = slotsByDay.get(key) ?? [];
    const dayEvents = eventsByDay.get(key) ?? [];
    const hasRelevant =
      mode === "select"
        ? daySlots.some((s) => s.available)
        : daySlots.length > 0 || dayEvents.length > 0;
    if (hasRelevant) return key;
  }

  return null;
}
