"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  Check,
  X,
  ChevronRight,
  Clock,
  Info,
} from "lucide-react";

// Types
type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
};

type TourDate = {
  id: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  registered: number;
  capacity: number;
  isUserRegistered?: boolean;
  price?: string;
};

type Participant = {
  id: string;
  name: string;
  department: string;
};

export default function TourDetailPage() {
  const params = useParams();
  const destinationId = params.destinationId as string;
  const tourId = params.tourId as string;

  // State for tour data
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tour, setTour] = useState<TourDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // State for dialogs
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);

  // Mock user booking for demo
  const [userBooking, setUserBooking] = useState<string | null>(
    "tam-dao-jun-20",
  );

  // Check if this tour is booked by the user
  const isUserBooking = userBooking === tourId;

  useEffect(() => {
    // Simulate fetching tour data
    const fetchTourData = () => {
      setLoading(true);

      // Mock data
      const destinations: Record<string, Destination> = {
        "tam-dao": {
          id: "tam-dao",
          name: "Tam Đảo",
          description:
            "Discover the misty mountains and cool climate of Tam Đảo, a perfect retreat from the summer heat. Enjoy breathtaking views, explore lush forests, and experience the unique mountain culture.",
          imageUrl: "/placeholder.svg?height=400&width=600",
          highlights: [
            "Explore the ancient stone church",
            "Hike through Thác Bạc (Silver Waterfall)",
            "Visit the Tam Đảo National Park",
            "Enjoy the cool mountain climate",
            "Experience local cuisine and culture",
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival & Exploration",
              description:
                "Morning departure from Hanoi. Arrive at Tam Đảo by noon. Check-in at accommodations. Afternoon exploration of the town center and stone church. Welcome dinner with local specialties.",
            },
            {
              day: 2,
              title: "Nature & Adventure",
              description:
                "Breakfast at hotel. Guided hiking tour to Thác Bạc (Silver Waterfall). Picnic lunch in nature. Afternoon visit to Tam Đảo National Park with expert guide. Free time for relaxation. Group dinner.",
            },
            {
              day: 3,
              title: "Cultural Experience & Departure",
              description:
                "Early morning yoga session (optional). Breakfast at hotel. Visit to local market and cultural sites. Lunch at a traditional restaurant. Afternoon departure to Hanoi, arriving by evening.",
            },
          ],
        },
        "ninh-binh": {
          id: "ninh-binh",
          name: "Ninh Bình",
          description:
            "Explore the 'Halong Bay on Land' with its stunning limestone karsts, peaceful rivers, and ancient temples. Ninh Bình offers a perfect blend of natural beauty and cultural heritage.",
          imageUrl: "/placeholder.svg?height=400&width=600",
          highlights: [
            "Boat tour through Tràng An or Tam Cốc",
            "Visit the ancient capital of Hoa Lư",
            "Explore Bái Đính Pagoda complex",
            "Hike up Mua Cave for panoramic views",
            "Cycle through rice fields and villages",
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival & Historical Sites",
              description:
                "Morning departure from Hanoi. Visit Hoa Lư ancient capital. Lunch at local restaurant. Afternoon exploration of Bái Đính Pagoda. Check-in at accommodations. Welcome dinner with traditional performances.",
            },
            {
              day: 2,
              title: "Natural Wonders",
              description:
                "Breakfast at hotel. Boat tour through Tràng An Scenic Landscape Complex. Lunch on boat or at local restaurant. Afternoon hike to Mua Cave viewpoint. Free time for relaxation. Group dinner.",
            },
            {
              day: 3,
              title: "Rural Experience & Departure",
              description:
                "Breakfast at hotel. Bicycle tour through villages and rice fields. Visit to local craft workshops. Lunch at a farm-to-table restaurant. Afternoon departure to Hanoi, arriving by evening.",
            },
          ],
        },
      };

      const tours: Record<string, TourDate> = {
        "tam-dao-jun-20": {
          id: "tam-dao-jun-20",
          destinationId: "tam-dao",
          startDate: "Jun 20, 2025",
          endDate: "Jun 22, 2025",
          registered: 45,
          capacity: 80,
          isUserRegistered: true,
          price: "Company Sponsored",
        },
        "tam-dao-jul-4": {
          id: "tam-dao-jul-4",
          destinationId: "tam-dao",
          startDate: "Jul 4, 2025",
          endDate: "Jul 6, 2025",
          registered: 20,
          capacity: 80,
          price: "Company Sponsored",
        },
        "ninh-binh-jun-20": {
          id: "ninh-binh-jun-20",
          destinationId: "ninh-binh",
          startDate: "Jun 20, 2025",
          endDate: "Jun 22, 2025",
          registered: 60,
          capacity: 90,
          price: "Company Sponsored",
        },
        "ninh-binh-jul-4": {
          id: "ninh-binh-jul-4",
          destinationId: "ninh-binh",
          startDate: "Jul 4, 2025",
          endDate: "Jul 6, 2025",
          registered: 90,
          capacity: 90,
          price: "Company Sponsored",
        },
      };

      const mockParticipants: Record<string, Participant[]> = {
        "tam-dao-jun-20": Array.from({ length: 45 }, (_, i) => ({
          id: `p${i + 1}`,
          name: `Participant ${i + 1}`,
          department: [
            "HR",
            "IT",
            "Marketing",
            "Finance",
            "Operations",
            "Sales",
          ][i % 6],
        })),
        "tam-dao-jul-4": Array.from({ length: 20 }, (_, i) => ({
          id: `p${i + 46}`,
          name: `Participant ${i + 46}`,
          department: [
            "HR",
            "IT",
            "Marketing",
            "Finance",
            "Operations",
            "Sales",
          ][i % 6],
        })),
        "ninh-binh-jun-20": Array.from({ length: 60 }, (_, i) => ({
          id: `p${i + 66}`,
          name: `Participant ${i + 66}`,
          department: [
            "HR",
            "IT",
            "Marketing",
            "Finance",
            "Operations",
            "Sales",
          ][i % 6],
        })),
        "ninh-binh-jul-4": Array.from({ length: 90 }, (_, i) => ({
          id: `p${i + 126}`,
          name: `Participant ${i + 126}`,
          department: [
            "HR",
            "IT",
            "Marketing",
            "Finance",
            "Operations",
            "Sales",
          ][i % 6],
        })),
      };

      // Set destination and tour
      setDestination(destinations[destinationId] || null);
      setTour(tours[tourId] || null);
      setParticipants(mockParticipants[tourId] || []);
      setLoading(false);
    };

    fetchTourData();
  }, [destinationId, tourId]);

  const handleRegister = () => {
    setUserBooking(tourId);
    setRegisterDialogOpen(false);
    // In a real app, you would make an API call here
  };

  const handleCancel = () => {
    setUserBooking(null);
    setCancelDialogOpen(false);
    // In a real app, you would make an API call here
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">
            Loading tour information...
          </p>
        </div>
      </div>
    );
  }

  if (!destination || !tour) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <h2 className="mb-2 text-xl font-semibold">Tour Not Found</h2>
        <p className="text-muted-foreground mb-6">{`The tour you're looking for doesn't exist.`}</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  // Check if this tour date is fully booked
  const isFullyBooked = tour.registered >= tour.capacity;

  return (
    <>
      {/* Hero section */}
      <div className="bg-primary/5 py-6">
        <div className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/destinations/${destination.id}`}
              className="hover:text-foreground"
            >
              {destination.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>
              {tour.startDate} - {tour.endDate}
            </span>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">
            {destination.name}: {tour.startDate} - {tour.endDate}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-8 overflow-hidden">
              <div className="from-primary/20 to-primary/10 relative h-48 bg-gradient-to-r">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary/40 text-3xl font-bold">
                    {destination.name}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <Calendar className="text-primary mb-2 h-8 w-8" />
                    <h3 className="font-medium">Trip Dates</h3>
                    <p className="text-muted-foreground text-center text-sm">
                      {tour.startDate} - {tour.endDate}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <Users className="text-primary mb-2 h-8 w-8" />
                    <h3 className="font-medium">Participants</h3>
                    <p className="text-muted-foreground text-sm">
                      {tour.registered}/{tour.capacity} registered
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <Clock className="text-primary mb-2 h-8 w-8" />
                    <h3 className="font-medium">Duration</h3>
                    <p className="text-muted-foreground text-sm">
                      3 days, 2 nights
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-4 text-lg font-medium">Trip Overview</h3>
                  <p className="text-muted-foreground">
                    {destination.description}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-4 text-lg font-medium">Daily Itinerary</h3>
                  <Tabs defaultValue="day-1" className="w-full">
                    <TabsList className="mb-4">
                      {destination.itinerary.map((day) => (
                        <TabsTrigger key={day.day} value={`day-${day.day}`}>
                          Day {day.day}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {destination.itinerary.map((day) => (
                      <TabsContent
                        key={day.day}
                        value={`day-${day.day}`}
                        className="rounded-md border p-4"
                      >
                        <h4 className="mb-2 text-base font-semibold">
                          {day.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {day.description}
                        </p>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <Separator className="my-6" />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Participants</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setParticipantsDialogOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View All ({participants.length})
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {participants.slice(0, 8).map((participant) => (
                      <Avatar
                        key={participant.id}
                        className="border-background h-10 w-10 border-2"
                      >
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                    {participants.length > 8 && (
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium">
                        +{participants.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Registration Status</CardTitle>
                  <CardDescription>
                    {isUserBooking
                      ? "You are registered for this trip"
                      : "Register for this trip"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Availability</span>
                        <span className="font-medium">
                          {tour.registered}/{tour.capacity}
                        </span>
                      </div>
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className={`h-full ${
                            isFullyBooked
                              ? "bg-red-500"
                              : tour.registered > tour.capacity * 0.7
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min((tour.registered / tour.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {isFullyBooked
                          ? "This trip is fully booked."
                          : `${tour.capacity - tour.registered} spots available.`}
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Info className="text-primary h-4 w-4" />
                        <span className="font-medium">Trip Status</span>
                      </div>

                      {isUserBooking ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="h-5 w-5" />
                          <span>You are registered for this trip</span>
                        </div>
                      ) : (
                        <div className="text-muted-foreground flex items-center gap-2">
                          <X className="h-5 w-5" />
                          <span>You are not registered for this trip</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                  {isUserBooking ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setRegisterDialogOpen(true)}
                      disabled={
                        isFullyBooked ||
                        (userBooking !== null && userBooking !== tourId)
                      }
                    >
                      {isFullyBooked
                        ? "Fully Booked"
                        : userBooking !== null && userBooking !== tourId
                          ? "Already Registered for Another Trip"
                          : "Register for Trip"}
                    </Button>
                  )}

                  {userBooking !== null && userBooking !== tourId && (
                    <p className="text-muted-foreground mt-2 text-center text-xs">
                      You must cancel your current booking before registering
                      for a new trip.
                    </p>
                  )}

                  <Separator className="my-4" />

                  <div className="w-full space-y-3">
                    <h4 className="text-sm font-medium">
                      Important Information
                    </h4>
                    <ul className="text-muted-foreground space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          Registration deadline: 2 weeks before departure
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          Cancellations allowed up to 1 week before departure
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          Departure from company headquarters at 7:00 AM
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-3 w-3 shrink-0" />
                        <span>Return to company headquarters by 8:00 PM</span>
                      </li>
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to register for the trip to{" "}
              <span className="font-medium">{destination.name}</span> from{" "}
              <span className="font-medium">
                {tour.startDate} to {tour.endDate}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegisterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRegister}>Confirm Registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for the trip to{" "}
              <span className="font-medium">{destination.name}</span> (
              {tour.startDate} - {tour.endDate})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Registration</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, Cancel Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Participants Dialog */}
      <Dialog
        open={participantsDialogOpen}
        onOpenChange={setParticipantsDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registered Participants</DialogTitle>
            <DialogDescription>
              {participants.length} people have registered for this journey
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-primary/5">
                      {participant.department}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
