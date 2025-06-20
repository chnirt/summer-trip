"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useBooking } from "@/contexts/booking-context";
import { formatDateRange } from "@/lib/dateUtils";
import DestinationCard, { Destination } from "@/components/destination-card";
import { useUserProfile } from "@/contexts/user-context";
import mobileBanner from "../../public/images/cyan-mobile-banner.png";
import tabletBanner from "../../public/images/cyan-tablet-banner.png";
import laptopBanner from "../../public/images/cyan-laptop-banner.png";
import BigLaptopBanner from "../../public/images/cyan-big-laptop-banner.png";

export default function HomePage() {
  const supabase = createClient();
  const user = useUserProfile();
  const { booking, fetchMyBooking } = useBooking();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profile?.email) {
      async function fetchData() {
        try {
          setIsLoading(true);
          setError(null);

          const region = user?.profile?.region;
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
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user]);

  return (
    <>
      <main className="flex-1">
        {/* Hero section */}
        <div className="bg-primary/5 relative py-10 md:py-14">
          <div className="absolute inset-0 z-0">
            <Image
              className="flex bg-[#01B0AE] md:hidden"
              src={mobileBanner}
              alt={"mobileBanner"}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <Image
              className="hidden bg-[#01B0AE] md:flex lg:hidden"
              src={tabletBanner}
              alt="tabletBanner"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <Image
              className="hidden bg-[#01B0AE] lg:flex xl:hidden"
              src={laptopBanner}
              alt="laptopBanner"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <Image
              className="hidden bg-[#01B0AE] xl:flex"
              src={BigLaptopBanner}
              alt="bigLaptopBanner"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="min-h-[200px] max-w-2xl">
              {/* <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover Your Perfect Summer Journey
              </h1>
              <p className="text-muted-foreground mt-4">
                Explore beautiful destinations and book your company-sponsored
                summer trip
              </p> */}

              <div>
                {booking && (
                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="text-black">
                        Bạn có một đặt phòng đang hoạt động cho{" "}
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
              Vui lòng chọn chuyến đi & ngày khởi hành
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
                Thử lại
              </Button>
            </div>
          ) : destinations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-muted-foreground">
                Không có điểm đến nào khả dụng.
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
