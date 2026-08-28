"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLogged = localStorage.getItem("Login") === "true";
    if (isLogged) {
      router.replace("/banner");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
