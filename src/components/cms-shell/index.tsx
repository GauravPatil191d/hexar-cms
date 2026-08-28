"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCMS } from "@/context/CMSContext";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { LoginContainer } from "@/containers/login-container";

export const CMSShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useCMS();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("Login");
    if (stored === "true" || isAuthenticated) {
      setIsLogged(true);
      if (pathname === "/" || pathname === "/login") {
        router.push("/banner");
      }
    } else {
      setIsLogged(false);
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
    setIsCheckingAuth(false);
  }, [pathname, isAuthenticated, router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isLogged || pathname === "/login") {
    return <LoginContainer />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="cms-page-wrapper flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
