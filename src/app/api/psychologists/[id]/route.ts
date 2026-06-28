import { NextResponse } from "next/server";
import { getPublicProfile } from "@/domain/psychologist";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) {
    return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}
