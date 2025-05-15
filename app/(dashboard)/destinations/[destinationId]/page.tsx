"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Info,
  Calendar,
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

export default function DestinationPage() {
  const params = useParams();
  const destinationId = params.destinationId as string;

  // State for destinations and tour dates
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock user booking for demo
  const [userBooking] = useState({
    destinationId: "tam-dao",
    tourId: "tam-dao-jun-20",
    startDate: "Jun 20, 2025",
    endDate: "Jun 22, 2025",
  });

  // Check if user has an active booking
  const hasActiveBooking = !!userBooking;

  // Mock images for gallery
  const images = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];

  useEffect(() => {
    // Simulate fetching destination data
    const fetchDestination = () => {
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
        "ha-long": {
          id: "ha-long",
          name: "Hạ Long Bay",
          description:
            "Experience the UNESCO World Heritage site with thousands of limestone islands rising from emerald waters. Cruise through the bay, explore caves, and enjoy fresh seafood.",
          imageUrl: "/placeholder.svg?height=400&width=600",
          highlights: [
            "Overnight cruise through the bay",
            "Kayaking around limestone karsts",
            "Visit to floating fishing villages",
            "Explore Sung Sot Cave (Surprise Cave)",
            "Cooking class and seafood dinner",
          ],
          itinerary: [
            {
              day: 1,
              title: "Departure & Embarkation",
              description:
                "Morning departure from Hanoi. Arrive at Halong Bay around noon. Board the cruise ship. Welcome lunch while cruising through the bay. Afternoon activities including cave exploration and kayaking. Sunset cocktails and dinner onboard.",
            },
            {
              day: 2,
              title: "Morning Bay & Return",
              description:
                "Tai Chi session at sunrise (optional). Breakfast onboard. Visit to floating village or more kayaking. Brunch served while cruising back to harbor. Disembark and return to Hanoi, arriving by evening.",
            },
          ],
        },
        sapa: {
          id: "sapa",
          name: "Sapa",
          description:
            "Discover terraced rice fields, trek through stunning mountains, and experience ethnic minority cultures in this highland region of northern Vietnam.",
          imageUrl: "/placeholder.svg?height=400&width=600",
          highlights: [
            "Trek through terraced rice fields",
            "Visit ethnic minority villages",
            "Climb Fansipan, the 'Roof of Indochina'",
            "Experience local homestay",
            "Shop at Sapa Market for handicrafts",
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival & Village Trek",
              description:
                "Morning departure from Hanoi. Arrive in Sapa by noon. Check-in at accommodations. Afternoon trek to Cat Cat Village of the H'mong people. Welcome dinner with local specialties.",
            },
            {
              day: 2,
              title: "Rice Terraces & Homestay",
              description:
                "Breakfast at hotel. Full-day trek through Muong Hoa Valley and terraced rice fields. Visit to Ta Van Village of the Dzay people. Overnight at local homestay with traditional dinner and cultural exchange.",
            },
            {
              day: 3,
              title: "Market & Departure",
              description:
                "Breakfast at homestay. Morning visit to Sapa Market. Free time for shopping and exploration. Lunch at local restaurant. Afternoon departure to Hanoi, arriving by evening.",
            },
          ],
        },
      };

      const tourDatesMock: Record<string, TourDate[]> = {
        "tam-dao": [
          {
            id: "tam-dao-jun-20",
            destinationId: "tam-dao",
            startDate: "Jun 20, 2025",
            endDate: "Jun 22, 2025",
            registered: 45,
            capacity: 80,
            isUserRegistered: true,
            price: "Company Sponsored",
          },
          {
            id: "tam-dao-jul-4",
            destinationId: "tam-dao",
            startDate: "Jul 4, 2025",
            endDate: "Jul 6, 2025",
            registered: 20,
            capacity: 80,
            price: "Company Sponsored",
          },
        ],
        "ninh-binh": [
          {
            id: "ninh-binh-jun-20",
            destinationId: "ninh-binh",
            startDate: "Jun 20, 2025",
            endDate: "Jun 22, 2025",
            registered: 60,
            capacity: 90,
            price: "Company Sponsored",
          },
          {
            id: "ninh-binh-jul-4",
            destinationId: "ninh-binh",
            startDate: "Jul 4, 2025",
            endDate: "Jul 6, 2025",
            registered: 90,
            capacity: 90,
            price: "Company Sponsored",
          },
        ],
        "ha-long": [
          {
            id: "ha-long-aug-15",
            destinationId: "ha-long",
            startDate: "Aug 15, 2025",
            endDate: "Aug 16, 2025",
            registered: 30,
            capacity: 60,
            price: "Company Sponsored",
          },
        ],
        sapa: [
          {
            id: "sapa-sep-10",
            destinationId: "sapa",
            startDate: "Sep 10, 2025",
            endDate: "Sep 12, 2025",
            registered: 25,
            capacity: 50,
            price: "Company Sponsored",
          },
        ],
      };

      // Set destination and tour dates
      setDestination(destinations[destinationId] || null);
      setTourDates(tourDatesMock[destinationId] || []);
      setLoading(false);
    };

    fetchDestination();
  }, [destinationId]);

  if (loading) {
    return (
      <>
        <main className="flex-1">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground mt-4">
                Loading destination information...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!destination) {
    return (
      <>
        <main className="flex-1">
          <div className="flex h-64 flex-col items-center justify-center">
            <h2 className="mb-2 text-xl font-semibold">
              Destination Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              {`The destination you're looking for doesn't exist.`}
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="flex-1">
        {/* Hero section with image gallery */}
        <div className="relative bg-black">
          <div className="relative h-[35vh] overflow-hidden md:h-[40vh] lg:h-[45vh]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="from-primary/20 to-primary/10 absolute inset-0 flex items-center justify-center bg-gradient-to-r">
              <span className="text-primary/40 text-4xl font-bold">
                {destination.name}
              </span>
            </div>

            <div className="absolute right-0 bottom-0 left-0 z-20 mx-auto max-w-7xl flex-1 px-4 py-8 pb-6 sm:px-6 lg:px-8">
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

          {/* Thumbnail gallery */}
          <div className="bg-black/90 py-3">
            <div className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
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

        <div className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {hasActiveBooking && userBooking.destinationId !== destination.id && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You already have an active booking for another destination. You
                must cancel your current booking before registering for a new
                trip.
              </AlertDescription>
            </Alert>
          )}

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

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <Clock className="text-primary mb-2 h-8 w-8" />
                      <h3 className="font-medium">Duration</h3>
                      <p className="text-muted-foreground text-center text-sm">
                        3 days, 2 nights
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <Users className="text-primary mb-2 h-8 w-8" />
                      <h3 className="font-medium">Group Size</h3>
                      <p className="text-muted-foreground text-sm">
                        Up to {Math.max(...tourDates.map((t) => t.capacity))}{" "}
                        people
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                      <MapPin className="text-primary mb-2 h-8 w-8" />
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground text-sm">
                        {destination.name}, Vietnam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="highlights" className="mb-8 w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="highlights">Highlights</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="highlights"
                  className="mt-6 rounded-md border p-6"
                >
                  <h3 className="mb-4 text-lg font-medium">Trip Highlights</h3>
                  <ul className="space-y-3">
                    {destination.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent
                  value="itinerary"
                  className="mt-6 rounded-md border p-6"
                >
                  <h3 className="mb-4 text-lg font-medium">Daily Itinerary</h3>
                  <div className="space-y-6">
                    {destination.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="border-primary/30 border-l-2 pl-4"
                      >
                        <h4 className="flex items-center gap-2 text-base font-semibold">
                          <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full text-sm">
                            {day.day}
                          </span>
                          {day.title}
                        </h4>
                        <p className="text-muted-foreground mt-2">
                          {day.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent
                  value="details"
                  className="mt-6 rounded-md border p-6"
                >
                  <h3 className="mb-4 text-lg font-medium">Trip Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Included</h4>
                      <ul className="text-muted-foreground mt-2 space-y-1">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span>Transportation from company headquarters</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span>Accommodation (shared rooms)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span>All meals as mentioned in the itinerary</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span>English-speaking guide</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                          <span>Entrance fees to attractions</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">Not Included</h4>
                      <ul className="text-muted-foreground mt-2 space-y-1">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                          <span>Personal expenses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                          <span>Travel insurance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                          <span>
                            Optional activities not mentioned in the itinerary
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">What to Bring</h4>
                      <ul className="text-muted-foreground mt-2 space-y-1">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="text-primary mt-1 h-4 w-4 shrink-0" />
                          <span>Comfortable walking shoes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="text-primary mt-1 h-4 w-4 shrink-0" />
                          <span>Weather-appropriate clothing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="text-primary mt-1 h-4 w-4 shrink-0" />
                          <span>Sunscreen and insect repellent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="text-primary mt-1 h-4 w-4 shrink-0" />
                          <span>Camera</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="text-primary mt-1 h-4 w-4 shrink-0" />
                          <span>Personal medications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
                        {tourDates.map((tourDate) => (
                          <TourDateCard
                            key={tourDate.id}
                            tourDate={tourDate}
                            hasActiveBooking={hasActiveBooking}
                            userBookingId={userBooking?.tourId}
                          />
                        ))}
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
      </main>
    </>
  );
}

function TourDateCard({
  tourDate,
  // hasActiveBooking,
  userBookingId,
}: {
  tourDate: TourDate;
  hasActiveBooking: boolean;
  userBookingId: string | undefined;
}) {
  // Check if this tour date is fully booked
  const isFullyBooked = tourDate.registered >= tourDate.capacity;

  // Check if this is the user's current booking
  const isUserBooking = tourDate.id === userBookingId;

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${isUserBooking ? "border-primary bg-primary/5" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <Calendar className="text-primary h-4 w-4" />
            <span className="font-medium">
              {tourDate.startDate} - {tourDate.endDate}
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

      {/* Progress bar for capacity */}
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
        <div className="text-sm">
          <span className="font-medium">{tourDate.price}</span>
        </div>

        <Link
          href={`/destinations/${tourDate.destinationId}/tours/${tourDate.id}`}
        >
          <Button size="sm" variant={isUserBooking ? "default" : "outline"}>
            {isUserBooking ? "View Booking" : "Select"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
