import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
