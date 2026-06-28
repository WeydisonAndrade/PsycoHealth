import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { canJoinRoom, endVideoSession } from "@/domain/video";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
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
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await endVideoSession(id, session!.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao encerrar" },
      { status: 400 }
    );
  }
}
