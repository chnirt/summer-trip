"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");
    }
  }, [router]);

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
