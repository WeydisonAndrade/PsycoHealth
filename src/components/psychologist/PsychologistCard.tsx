import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface PsychologistCardProps {
  id: string;
  name: string;
  crp: string;
  bio: string;
  specialties: string[];
  sessionPrice: number;
}

export function PsychologistCard({
  id,
  name,
  crp,
  bio,
  specialties,
  sessionPrice,
}: PsychologistCardProps) {
  return (
    <Card className="psychologist-card">
      <div>
        <h3 className="card-title">{name}</h3>
        <p className="card-subtitle">CRP {crp}</p>
      </div>
      {bio && <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{bio.slice(0, 120)}{bio.length > 120 ? "..." : ""}</p>}
      <div className="tags">
        {specialties.slice(0, 3).map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
      </div>
      <p className="price">{formatCurrency(sessionPrice)}</p>
      <Link href={`/psychologists/${id}`}>
        <Button fullWidth>Ver perfil</Button>
      </Link>
    </Card>
  );
}
