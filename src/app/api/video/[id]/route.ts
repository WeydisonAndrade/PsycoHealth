/**
 * GET /api/video/[id] — verifica permissão e retorna dados da sala de vídeo (Jitsi).
 * DELETE /api/video/[id] — encerra a sessão de vídeo da consulta.
 * Métodos: GET, DELETE
 * Autenticação: requerida; o usuário deve ser participante da consulta.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canJoinRoom, endVideoSession } from "@/domain/video";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificação de autenticação
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // Validação de permissão para entrar na sala
  const result = await canJoinRoom(id, session!.userId);

  if (!result.allowed) {
    return NextResponse.json({ error: result.reason }, { status: 403 });
  }

  return NextResponse.json({
    roomId: result.roomId,
    jitsiUrl: result.jitsiUrl,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificação de autenticação
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Encerramento da sessão de vídeo via serviço de domínio
    await endVideoSession(id, session!.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Tratamento de erros de domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao encerrar" },
      { status: 400 }
    );
  }
}
