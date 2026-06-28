import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/components/ui/components.css";

/** Layout das páginas do MVP (login, dashboard, psicólogos, etc.) */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
