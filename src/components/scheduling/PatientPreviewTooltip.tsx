/**
 * Tooltip com breve relato do paciente para o calendário do psicólogo.
 */
import type { CalendarSlot } from "@/domain/scheduling";
import { formatTime } from "@/lib/calendar-utils";

interface PatientPreviewTooltipProps {
  slots: CalendarSlot[];
}

function truncate(text: string, max = 180): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function PatientPreviewTooltip({ slots }: PatientPreviewTooltipProps) {
  return (
    <div className="calendar-preview-tooltip" role="tooltip">
      {slots.map((slot) => (
        <div key={slot.datetime} className="calendar-preview-item">
          <p className="calendar-preview-header">
            <strong>{slot.label}</strong>
            <span>{formatTime(slot.datetime)}</span>
          </p>
          <p className="calendar-preview-text">
            {slot.patientConcerns
              ? truncate(slot.patientConcerns)
              : "Nenhum relato registrado pelo paciente."}
          </p>
        </div>
      ))}
    </div>
  );
}
