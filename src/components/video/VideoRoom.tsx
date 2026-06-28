"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface VideoRoomProps {
  appointmentId: string;
  userRole?: "PATIENT" | "PSYCHOLOGIST";
}

export function VideoRoom({ appointmentId, userRole = "PATIENT" }: VideoRoomProps) {
  const router = useRouter();
  const [jitsiUrl, setJitsiUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);

  const dashboard =
    userRole === "PSYCHOLOGIST" ? "/dashboard/psychologist" : "/dashboard/patient";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/video/${appointmentId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Não foi possível entrar na sala");
          return;
        }

        setJitsiUrl(data.jitsiUrl);
      } catch {
        setError("Erro de conexão");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [appointmentId]);

  async function handleEnd() {
    setEnding(true);
    try {
      await fetch(`/api/video/${appointmentId}`, { method: "DELETE" });
      router.push(dashboard);
      router.refresh();
    } catch {
      setError("Erro ao encerrar sessão");
    } finally {
      setEnding(false);
    }
  }

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>Preparando sala de vídeo...</p>;
  }

  if (error) {
    return (
      <Card title="Videochamada">
        <Alert type="error">{error}</Alert>
      </Card>
    );
  }

  return (
    <div>
      <Card title="Consulta por vídeo" subtitle="Sala segura via Jitsi Meet">
        <div className="video-container">
          {jitsiUrl && (
            <iframe
              src={`${jitsiUrl}#config.prejoinPageEnabled=false`}
              allow="camera; microphone; fullscreen; display-capture"
              title="Videochamada PsycoHealth"
            />
          )}
        </div>
        <Button className="mt-2" variant="danger" onClick={handleEnd} disabled={ending}>
          {ending ? "Encerrando..." : "Encerrar consulta"}
        </Button>
      </Card>
    </div>
  );
}
