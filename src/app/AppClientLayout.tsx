"use client";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useThemeForce } from "../hooks/useThemeForce";

export default function AppClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  
  // Forzar el tema independientemente del sistema
  useThemeForce();
  
  return (
    <>
      {!isDashboard && <Header />}
      <div className={isDashboard ? "min-h-screen" : "pt-32 pb-10 min-h-[70vh] flex flex-col justify-center"}>
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
