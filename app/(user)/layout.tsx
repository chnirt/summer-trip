import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { UserProvider } from "@/contexts/user-context";
import { BookingProvider } from "@/contexts/booking-context";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <BookingProvider>{children}</BookingProvider>
      </div>
    </UserProvider>
  );
}
