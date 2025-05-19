"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { useBooking } from "@/contexts/booking-context";
import { formatDateRange } from "@/lib/dateUtils";

import backgroundImage from "../../public/background.jpg";

// Types
type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trip_count: number;
  region: string;
};

export default function HomePage() {
  const supabase = createClient();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { booking, fetchMyBooking } = useBooking();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUserLoaded && user?.id) {
      async function fetchData() {
        try {
          setIsLoading(true);
          setError(null);

          // Fetch user profile and booking data in parallel
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("region")
            .eq("user_id", user?.id)
            .single();

          // Handle profile fetch error
          if (profileError) {
            console.error("Failed to fetch profile:", profileError);
            setError("Unable to load your profile information.");
            setIsLoading(false);
            return;
          }

          const region = profile?.region;
          if (!region) {
            setError("User region not found in profile.");
            setIsLoading(false);
            return;
          }

          // Fetch destinations based on user's region
          const { data: destinations, error: destinationsError } =
            await supabase
              .from("destinations")
              .select("*")
              .eq("region", region)
              .eq("status", "active");

          if (destinationsError) {
            console.error("Failed to fetch destinations:", destinationsError);
            setError("Unable to load destinations.");
            setIsLoading(false);
            return;
          }

          setDestinations(destinations || []);
          setIsLoading(false);
        } catch (error) {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
          setIsLoading(false);
        }
      }

      fetchData();
      fetchMyBooking();
    } else if (isUserLoaded && !user) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoaded, supabase, user]);

  return (
    <>
      <main className="flex-1">
        {/* Hero section */}
        <div className="bg-primary/5 relative py-10 md:py-14">
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover Your Perfect Summer Journey
              </h1>
              <p className="text-muted-foreground mt-4">
                Explore beautiful destinations and book your company-sponsored
                summer trip
              </p>

              <div>
                {booking && (
                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="text-black">
                        You have an active booking for{" "}
                        <span className="font-bold">
                          {booking.destinationName}
                        </span>{" "}
                        <Link
                          href={`/destinations/${booking.destinationId}`}
                          className="font-medium underline underline-offset-4"
                        >
                          {formatDateRange(booking.startDate, booking.endDate)}
                        </Link>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Available Destinations
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="text-primary h-10 w-10 animate-spin" />
            </div>
          ) : error ? (
            <div className="border-destructive rounded-lg border border-dashed p-10 text-center">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : destinations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-muted-foreground">
                No destinations available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Card className="group overflow-hidden py-0 transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="from-primary/20 to-primary/10 absolute inset-0 flex items-center justify-center bg-gradient-to-r">
          <span className="text-primary/40 text-2xl font-bold">
            {destination.name}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 z-20">
          <h3 className="text-lg font-semibold text-white">
            {destination.name}
          </h3>
          {destination.trip_count > 0 ? (
            <div className="flex items-center gap-1 text-sm text-white/90">
              <span>{destination.trip_count} trips available</span>
            </div>
          ) : null}
        </div>
        {/* <Badge className="absolute top-3 right-3 z-20">Popular</Badge> */}
      </div>

      <CardContent className="p-4">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {destination.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/destinations/${destination.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
