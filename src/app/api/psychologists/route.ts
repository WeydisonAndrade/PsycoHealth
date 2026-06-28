import { NextResponse } from "next/server";
import { listPsychologists } from "@/domain/psychologist";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty") ?? undefined;

  const psychologists = await listPsychologists({ specialty });
  return NextResponse.json({ psychologists });
}
