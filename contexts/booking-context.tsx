"use client";

import { createClient } from "@/utils/supabase/client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useUserProfile } from "./user-context";

interface Booking {
  id: string;
  tourId: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
}

interface BookingContextType {
  booking: Booking | undefined;
  fetchMyBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const user = useUserProfile();

  const [booking, setBooking] = useState<Booking | undefined>(undefined);

  async function fetchMyBooking() {
    try {
      // Fetch user profile and booking data in parallel
      const bookingResponse = await supabase
        .from("bookings")
        .select(
          `
            id,
            tour_id,
            user_id,
            tours (
              start_date,
              end_date,
              destination_id,
              destinations (
                name
              )
            )
          `,
        )
        .eq("user_id", user?.profile?.id)
        .single();

      // Handle booking fetch error or absence of booking
      if (bookingResponse.error) {
        setBooking(undefined);
        return;
      }
      if (bookingResponse.data) {
        interface Tour {
          start_date: string;
          end_date: string;
          destination_id: string;
          destinations?: {
            name?: string;
          };
        }
        const tour = bookingResponse.data.tours as unknown as Tour;
        setBooking({
          id: bookingResponse.data.id,
          tourId: bookingResponse.data.tour_id,
          destinationId: tour?.destination_id,
          destinationName: tour?.destinations?.name || "Unknown Destination",
          startDate: tour?.start_date,
          endDate: tour?.end_date,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  return (
    <BookingContext.Provider value={{ booking, fetchMyBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
