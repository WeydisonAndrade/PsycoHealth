"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

interface SlotPickerProps {
  psychologistId: string;
  onSelect: (datetime: string) => void;
  selected?: string;
}

export function SlotPicker({ psychologistId, onSelect, selected }: SlotPickerProps) {
  const [slots, setSlots] = useState<{ datetime: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/psychologists/${psychologistId}/slots`);
        const data = await res.json();
        setSlots(data.slots.filter((s: { available: boolean }) => s.available));
      } catch {
        setError("Erro ao carregar horários");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [psychologistId]);

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Carregando horários...</p>;
  if (error) return <Alert type="error">{error}</Alert>;
  if (slots.length === 0) {
    return <Alert type="info">Nenhum horário disponível nos próximos 14 dias</Alert>;
  }

  return (
    <div className="slots-grid">
      {slots.map((slot) => (
        <button
          key={slot.datetime}
          type="button"
          className={`slot-btn ${selected === slot.datetime ? "selected" : ""}`}
          onClick={() => onSelect(slot.datetime)}
        >
          {formatDateTime(slot.datetime)}
        </button>
      ))}
    </div>
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
      setError("Selecione um horário");
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
