"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { DAYS_OF_WEEK } from "@/lib/utils";

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface AvailabilityEditorProps {
  initialSlots: Slot[];
}

const emptySlot = (): Slot => ({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });

export function AvailabilityEditor({ initialSlots }: AvailabilityEditorProps) {
  const [slots, setSlots] = useState<Slot[]>(
    initialSlots.length > 0 ? initialSlots : [emptySlot()]
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateSlot(index: number, field: keyof Slot, value: string | number) {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSlot() {
    setSlots((prev) => [...prev, emptySlot()]);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/psychologists/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar");
        return;
      }

      setMessage("Disponibilidade atualizada");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Disponibilidade semanal">
      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      {slots.map((slot, index) => (
        <div key={index} className="form-row mb-2" style={{ alignItems: "end" }}>
          <Select
            label="Dia"
            value={slot.dayOfWeek}
            onChange={(e) => updateSlot(index, "dayOfWeek", Number(e.target.value))}
            options={DAYS_OF_WEEK.map((d, i) => ({ value: i, label: d }))}
          />
          <InputTime
            label="Início"
            value={slot.startTime}
            onChange={(v) => updateSlot(index, "startTime", v)}
          />
          <InputTime
            label="Fim"
            value={slot.endTime}
            onChange={(v) => updateSlot(index, "endTime", v)}
          />
          {slots.length > 1 && (
            <Button type="button" variant="ghost" size="sm" onClick={() => removeSlot(index)}>
              Remover
            </Button>
          )}
        </div>
      ))}

      <div className="mt-2" style={{ display: "flex", gap: "0.75rem" }}>
        <Button type="button" variant="secondary" onClick={addSlot}>
          Adicionar horário
        </Button>
        <Button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar disponibilidade"}
        </Button>
      </div>
    </Card>
  );
}

function InputTime({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="form-group">
      <label className="label">{label}</label>
      <input
        type="time"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
