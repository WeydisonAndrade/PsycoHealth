import { prisma } from "@/lib/db";
import { parseSpecialties, stringifySpecialties } from "@/lib/utils";
import type { UpdateProfileInput, SetAvailabilityInput } from "./schemas";

export async function listPsychologists(filters?: { specialty?: string }) {
  const profiles = await prisma.psychologistProfile.findMany({
    where: {
      isActive: true,
      ...(filters?.specialty
        ? { specialties: { contains: filters.specialty } }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      availability: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return profiles.map((p) => ({
    ...p,
    specialties: parseSpecialties(p.specialties),
  }));
}

export async function getPublicProfile(psychologistId: string) {
  const profile = await prisma.psychologistProfile.findUnique({
    where: { id: psychologistId, isActive: true },
    include: {
      user: { select: { id: true, name: true } },
      availability: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
    },
  });

  if (!profile) return null;

  return {
    ...profile,
    specialties: parseSpecialties(profile.specialties),
  };
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.psychologistProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      availability: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
    },
  });

  if (!profile) return null;

  return {
    ...profile,
    specialties: parseSpecialties(profile.specialties),
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const profile = await prisma.psychologistProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  const updated = await prisma.psychologistProfile.update({
    where: { userId },
    data: {
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.specialties && { specialties: stringifySpecialties(input.specialties) }),
      ...(input.sessionPrice !== undefined && { sessionPrice: input.sessionPrice }),
      ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl || null }),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      availability: true,
    },
  });

  return {
    ...updated,
    specialties: parseSpecialties(updated.specialties),
  };
}

export async function setAvailability(userId: string, input: SetAvailabilityInput) {
  const profile = await prisma.psychologistProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  await prisma.$transaction([
    prisma.availabilitySlot.deleteMany({ where: { psychologistId: profile.id } }),
    ...input.slots.map((slot) =>
      prisma.availabilitySlot.create({
        data: {
          psychologistId: profile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      })
    ),
  ]);

  return getProfileByUserId(userId);
}

export async function getPsychologistEarnings(userId: string) {
  const profile = await prisma.psychologistProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Perfil não encontrado");

  const payments = await prisma.payment.findMany({
    where: {
      status: "PAID",
      appointment: { psychologistId: profile.id },
    },
    include: {
      appointment: {
        select: {
          scheduledAt: true,
          patient: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { paidAt: "desc" },
  });

  const totalEarnings = payments.reduce((sum, p) => sum + p.psychologistPayout, 0);
  const totalSessions = payments.length;

  return { payments, totalEarnings, totalSessions };
}
