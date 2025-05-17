import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BookingProvider } from "@/contexts/booking-context";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <BookingProvider>{children}</BookingProvider>
      <Footer />
    </div>
  );
}
