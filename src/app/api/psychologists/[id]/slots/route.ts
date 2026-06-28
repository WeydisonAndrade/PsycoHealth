import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAvailableSlots } from "@/domain/scheduling";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString();

  const slots = await getAvailableSlots(id, new Date(from));
  return NextResponse.json({ slots });
}
