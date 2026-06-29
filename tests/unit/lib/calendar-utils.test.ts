import { describe, expect, it } from "vitest";
import {
  addMonths,
  getMonthGrid,
  groupSlotsByDay,
  startOfMonth,
  toLocalDateKey,
} from "@/lib/calendar-utils";

describe("calendar-utils", () => {
  it("startOfMonth zera horas e dia 1", () => {
    const d = startOfMonth(new Date(2026, 5, 15, 14, 30));
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(5);
    expect(d.getHours()).toBe(0);
  });

  it("addMonths navega entre meses", () => {
    const jan = startOfMonth(new Date(2026, 0, 10));
    const feb = addMonths(jan, 1);
    expect(feb.getMonth()).toBe(1);
  });

  it("getMonthGrid retorna 42 células", () => {
    const grid = getMonthGrid(new Date(2026, 5, 1));
    expect(grid).toHaveLength(42);
    expect(grid.some((c) => c.isCurrentMonth)).toBe(true);
  });

  it("toLocalDateKey formata YYYY-MM-DD", () => {
    const key = toLocalDateKey(new Date(2026, 5, 28));
    expect(key).toBe("2026-06-28");
  });

  it("groupSlotsByDay agrupa por data local", () => {
    const map = groupSlotsByDay([
      { datetime: new Date(2026, 5, 28, 10, 0).toISOString(), available: true },
      { datetime: new Date(2026, 5, 28, 11, 0).toISOString(), available: false },
      { datetime: new Date(2026, 5, 29, 10, 0).toISOString(), available: true },
    ]);
    expect(map.get("2026-06-28")).toHaveLength(2);
    expect(map.get("2026-06-29")).toHaveLength(1);
  });
});
