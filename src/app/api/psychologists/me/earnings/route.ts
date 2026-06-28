import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getPsychologistEarnings } from "@/domain/psychologist";

export async function GET() {
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    const earnings = await getPsychologistEarnings(session!.userId);
    return NextResponse.json(earnings);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 400 }
    );
  }
}
