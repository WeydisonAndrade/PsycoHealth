import Link from "next/link";
import { getSession } from "@/lib/session";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const session = await getSession();

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          PsycoHealth
        </Link>
        <HeaderNav session={session} />
      </div>
    </header>
  );
}
