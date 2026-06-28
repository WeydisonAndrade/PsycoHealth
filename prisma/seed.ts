import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 12);

  const psychologist = await prisma.user.upsert({
    where: { email: "psicologo@psycohealth.com" },
    update: {},
    create: {
      email: "psicologo@psycohealth.com",
      name: "Dra. Ana Silva",
      passwordHash,
      role: UserRole.PSYCHOLOGIST,
      psychologistProfile: {
        create: {
          crp: "06/123456",
          bio: "Psicóloga clínica com 10 anos de experiência em TCC. Atendimento online humanizado.",
          specialties: JSON.stringify(["Ansiedade", "Depressão", "Estresse"]),
          sessionPrice: 180,
        },
      },
    },
    include: { psychologistProfile: true },
  });

  if (psychologist.psychologistProfile) {
    await prisma.availabilitySlot.deleteMany({
      where: { psychologistId: psychologist.psychologistProfile.id },
    });
    await prisma.availabilitySlot.createMany({
      data: [
        {
          psychologistId: psychologist.psychologistProfile.id,
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          psychologistId: psychologist.psychologistProfile.id,
          dayOfWeek: 2,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          psychologistId: psychologist.psychologistProfile.id,
          dayOfWeek: 3,
          startTime: "14:00",
          endTime: "20:00",
        },
        {
          psychologistId: psychologist.psychologistProfile.id,
          dayOfWeek: 4,
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          psychologistId: psychologist.psychologistProfile.id,
          dayOfWeek: 5,
          startTime: "09:00",
          endTime: "12:00",
        },
      ],
    });
  }

  await prisma.user.upsert({
    where: { email: "paciente@psycohealth.com" },
    update: {},
    create: {
      email: "paciente@psycohealth.com",
      name: "João Santos",
      passwordHash,
      role: UserRole.PATIENT,
      patientProfile: {
        create: { phone: "(11) 98765-4321" },
      },
    },
  });

  console.log("Seed concluído:");
  console.log("  Psicólogo: psicologo@psycohealth.com / senha123");
  console.log("  Paciente:  paciente@psycohealth.com / senha123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
