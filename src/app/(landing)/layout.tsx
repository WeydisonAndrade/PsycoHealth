import { LegacyHeader } from "@/components/landing/LegacyHeader";
import { LegacyFooter } from "@/components/landing/LegacyFooter";
import { ScrollAnimations } from "@/components/landing/ScrollAnimations";
import "@/styles/legacy-landing.css";

/** Layout da landing — réplica fiel do index.html legado */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="legacy-home">
      <a href="#main" className="visually-hidden">
        Pular para o conteúdo principal
      </a>
      <LegacyHeader />
      <main id="main">{children}</main>
      <LegacyFooter />
      <ScrollAnimations />
    </div>
  );
}
