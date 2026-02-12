"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // List of pages where the Sidebar should be HIDDEN
  const isAuthPage = pathname === "/login" || pathname === "/logout";

  return (
    <>
      {/* Only show Sidebar if we are NOT on an auth page */}
      {!isAuthPage && <Sidebar />}

      {/* If Sidebar is visible, add margin (ml-64). 
         If hidden (Login page), center content (no margin).
      */}
      <main className={`flex-1 min-h-screen transition-all ${!isAuthPage ? "ml-64 p-8" : "p-0"}`}>
        {children}
      </main>
    </>
  );
}