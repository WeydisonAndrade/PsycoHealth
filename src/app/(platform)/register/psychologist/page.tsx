/**
 * Página de cadastro de psicólogos.
 * Coleta CRP, especialidades, preço da sessão e demais dados profissionais.
 */
import { RegisterPsychologistForm } from "@/components/auth/RegisterPsychologistForm";

export default function RegisterPsychologistPage() {
  return (
    <div className="page">
      <div className="container">
        {/* Formulário de registro com perfil do tipo PSYCHOLOGIST */}
        <RegisterPsychologistForm />
      </div>
    </div>
  );
}
