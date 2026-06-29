/**
 * Seed de demonstração — popula o banco com contas de teste.
 * Executar: npm run db:seed
 *
 * Cria:
 * - 1 psicólogo com disponibilidade semanal (seg–sex)
 * - 1 paciente
 * Senha padrão: senha123
 */

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash único reutilizado nas duas contas de demo
  const passwordHash = await bcrypt.hash("senha123", 12);

  // --- Psicólogo de demonstração ---
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

  // Recria slots de disponibilidade a cada seed (idempotente)
  if (psychologist.psychologistProfile) {
    await prisma.availabilitySlot.deleteMany({
      where: { psychologistId: psychologist.psychologistProfile.id },
    });
    await prisma.availabilitySlot.createMany({
      data: [
        { psychologistId: psychologist.psychologistProfile.id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
        { psychologistId: psychologist.psychologistProfile.id, dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
        { psychologistId: psychologist.psychologistProfile.id, dayOfWeek: 3, startTime: "14:00", endTime: "20:00" },
        { psychologistId: psychologist.psychologistProfile.id, dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
        { psychologistId: psychologist.psychologistProfile.id, dayOfWeek: 5, startTime: "09:00", endTime: "12:00" },
      ],
    });
  }

  // --- Paciente de demonstração ---
  const patientUser = await prisma.user.upsert({
    where: { email: "paciente@psycohealth.com" },
    update: {},
    create: {
      email: "paciente@psycohealth.com",
      name: "João Santos",
      passwordHash,
      role: UserRole.PATIENT,
      patientProfile: {
        create: {
          phone: "(11) 98765-4321",
          concerns:
            "Ansiedade intensa no trabalho, dificuldade para dormir e sensação constante de sobrecarga.",
        },
      },
    },
    include: { patientProfile: true },
  });

  if (patientUser.patientProfile) {
    await prisma.patientProfile.update({
      where: { id: patientUser.patientProfile.id },
      data: {
        concerns:
          "Ansiedade intensa no trabalho, dificuldade para dormir e sensação constante de sobrecarga.",
      },
    });
  }

  console.log("Seed concluído:");
  console.log("  Psicólogo: psicologo@psycohealth.com / senha123");
  console.log("  Paciente:  paciente@psycohealth.com / senha123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
