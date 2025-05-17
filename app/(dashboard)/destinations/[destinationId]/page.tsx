"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Clock,
  Users,
  Info,
  Calendar,
  Loader2,
  LoaderCircle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useBooking } from "@/contexts/booking-context";
import { formatDateRange } from "@/lib/dateUtils";

// Types
type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  infographicUrl: string;
  details: {
    included: string[];
    notIncluded: string[];
    toBring: string[];
  };
};

type TourDate = {
  id: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  registered: number;
  capacity: number;
  isUserRegistered?: boolean;
  registeredUsers?: RegisteredUser[];
};

type RegisteredUser = {
  id: string;
  name: string;
  // avatar: string;
  department: string;
};

export default function DestinationPage() {
  const supabase = createClient();

  const { user, isLoaded: isUserLoaded } = useUser();
  const params = useParams();
  const { booking, fetchMyBooking } = useBooking();
  const destinationId = params.destinationId as string;

  // State
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [registeredUsersDialogOpen, setRegisteredUsersDialogOpen] =
    useState(false);
  const [selectedTourUsers, setSelectedTourUsers] = useState<RegisteredUser[]>(
    [],
  );
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  // Mock user ID for demo
  const currentUserId = "user-123";

  // Mock images for gallery
  const images = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];

  async function fetchTourDates() {
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("destination_id", destinationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tours:", error);
      setError("Could not load tours");
      setTourDates([]);
      return null;
    }
    setTourDates(
      data.map((item) => ({
        ...item,
        startDate: item.start_date,
        endDate: item.end_date,
      })),
    );
    return data;
  }

  // Fetch destinations when user is loaded
  useEffect(() => {
    async function fetchDestination() {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", destinationId)
        .single();

      if (error) {
        console.error("Error fetching destination:", error);
        setError("Could not load destination");
        setDestination(null);
        return null;
      }
      setDestination(data);
      return data;
    }

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([
          fetchDestination(),
          fetchTourDates(),
          fetchMyBooking(),
        ]);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (isUserLoaded && user) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId, isUserLoaded, supabase, user]);

  const handleBooking = async (tourId: string) => {
    const hasExistingBooking = tourDates.some((date) => date.isUserRegistered);

    if (hasExistingBooking) {
      alert(
        "You already have an active booking. Please cancel it before booking a new trip.",
      );
      return;
    }

    setSelectedTourId(tourId);
    setBookingDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedTourId) return;

    setIsBookingLoading(true);

    try {
      if (!user) {
        toast.error("Profile update failed", {
          description: "User authentication required",
        });
        setIsBookingLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.rpc("book_tour_atomic", {
        p_tour_id: selectedTourId,
        p_user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Booking successful!");
        await Promise.all([fetchTourDates(), fetchMyBooking()]);
      }

      setBookingDialogOpen(false);
    } catch (err) {
      console.error("Failed to book tour:", err);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleCancellation = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBookingId) return;

    setIsCancelLoading(true);

    try {
      if (!user) {
        toast.error("Profile update failed", {
          description: "User authentication required",
        });
        setIsCancelLoading(false);
        return;
      }

      const { error } = await supabase.rpc("cancel_booking_atomic", {
        p_booking_id: selectedBookingId,
        p_user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Booking canceled successfully!");
        await Promise.all([fetchTourDates(), fetchMyBooking()]);
      }

      setCancelDialogOpen(false);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const showRegisteredUsers = async (tourId: string) => {
    try {
      // 1. Fetch bookings by tourId
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("tour_id", tourId);

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        return null;
      }

      if (!bookings || bookings.length === 0) {
        setSelectedTourUsers([]);
        return [];
      }

      // 2. Extract user IDs from bookings
      const userIds = bookings.map((b) => b.user_id);

      // 3. Fetch profiles for those user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, department")
        .in("user_id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        setSelectedTourUsers([]);
        return null;
      }

      // 4. Create a map for quick profile lookup by user_id
      const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      // 5. Merge bookings with corresponding profiles and map to user info
      const users = bookings.map((booking) => {
        const profile = profilesMap.get(booking.user_id);
        return {
          id: profile?.user_id || null,
          name: profile?.full_name || "Unknown",
          // avatar: "", // add if available
          department: profile?.department || "Unknown",
        };
      });

      setSelectedTourUsers(users);
      setRegisteredUsersDialogOpen(true);

      return users;
    } catch (error) {
      console.error("Unexpected error:", error);
      setSelectedTourUsers([]);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!destination) {
    return null;
  }

  return (
    <>
      <div className="relative bg-black">
        <div className="relative h-[35vh] overflow-hidden md:h-[40vh] lg:h-[45vh]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="from-primary/20 to-primary/10 absolute inset-0 flex items-center justify-center bg-gradient-to-r">
            <span className="text-primary/40 text-4xl font-bold">
              {destination.name}
            </span>
          </div>
          <div className="absolute right-0 bottom-0 left-0 z-20 mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-white/80">
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span>{destination.name}</span>
                </div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  {destination.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black/90 py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ${
                    activeImageIndex === index
                      ? "ring-primary ring-2 ring-offset-2 ring-offset-black"
                      : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div className="from-primary/20 to-primary/10 absolute inset-0 bg-gradient-to-r" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">
                  About {destination.name}
                </h2>
                <p className="text-muted-foreground">
                  {destination.description}
                </p>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">Trip Itinerary</h2>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={destination.infographicUrl || "/placeholder.svg"}
                    alt={`${destination.name} Itinerary`}
                    width={800}
                    height={600}
                    className="h-auto w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold">
                    Available Dates
                  </h3>
                  {tourDates.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">
                        No dates available for this destination.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tourDates.map((tourDate) => {
                        const isUserRegistered =
                          tourDate.id === booking?.tourId;
                        return (
                          <TourDateCard
                            key={tourDate.id}
                            tourDate={tourDate}
                            onBook={() => handleBooking(tourDate.id)}
                            onCancel={() =>
                              booking
                                ? handleCancellation(booking.id)
                                : undefined
                            }
                            onShowUsers={() => showRegisteredUsers(tourDate.id)}
                            isUserRegistered={isUserRegistered}
                            hasBooked={!!booking}
                          />
                        );
                      })}
                    </div>
                  )}
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h4 className="font-medium">Important Information</h4>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Registration deadline: 2 weeks before departure
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Cancellations allowed up to 1 week before departure
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>You can only book one trip at a time</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to book this trip? You can only have one
              active booking at a time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmBooking} disabled={isBookingLoading}>
              {isBookingLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={isCancelLoading}
            >
              {isCancelLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={registeredUsersDialogOpen}
        onOpenChange={setRegisteredUsersDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registered Participants</DialogTitle>
            <DialogDescription>
              {selectedTourUsers.length} people have registered for this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {selectedTourUsers.map((user) => (
                <div
                  key={user.id}
                  className="hover:bg-muted flex items-center justify-between rounded-md p-2"
                >
                  <div className="flex items-center gap-3">
                    {/* <div className="bg-muted h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div> */}
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      {user.id === currentUserId && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      {user.department}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

function TourDateCard({
  tourDate,
  onBook,
  onCancel,
  onShowUsers,
  isUserRegistered,
  hasBooked,
}: {
  tourDate: TourDate;
  onBook: () => void;
  onCancel: () => void;
  onShowUsers: () => void;
  isUserRegistered: boolean;
  hasBooked: boolean;
}) {
  const isFullyBooked = tourDate.registered >= tourDate.capacity;
  const isUserBooking = isUserRegistered;

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${isUserBooking ? "border-primary bg-primary/5" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <Calendar className="text-primary h-4 w-4" />
            <span className="font-medium">
              {formatDateRange(tourDate.startDate, tourDate.endDate)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              {getDurationDays(tourDate.startDate, tourDate.endDate)} days
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Group size: {tourDate.capacity}
            </span>
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            {tourDate.capacity - tourDate.registered === 0
              ? "No spots available"
              : `${tourDate.capacity - tourDate.registered} spots available`}
          </div>
        </div>
        {isFullyBooked && <Badge variant="destructive">Full</Badge>}
        {isUserBooking && (
          <Badge variant="outline" className="border-primary text-primary">
            Booked
          </Badge>
        )}
      </div>
      <div className="bg-muted mt-3 h-2 overflow-hidden rounded-full">
        <div
          className={`h-full ${
            isFullyBooked
              ? "bg-red-500"
              : tourDate.registered > tourDate.capacity * 0.7
                ? "bg-amber-500"
                : "bg-green-500"
          }`}
          style={{
            width: `${Math.min((tourDate.registered / tourDate.capacity) * 100, 100)}%`,
          }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex w-full gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onShowUsers}
            className="flex-1"
            disabled={tourDate.registered === 0}
          >
            <Users className="mr-1 h-4 w-4" />
            <span>{tourDate.registered} Participants</span>
          </Button>
          {isUserBooking ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel Booking
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onBook}
              disabled={isFullyBooked || hasBooked}
              className="flex-1"
            >
              Book Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
