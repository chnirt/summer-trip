"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Search, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import backgroundImage from "../../public/background.jpg";

// Types
type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tripCount: number;
};

export default function HomePage() {
  // State for destinations
  const [destinations] = useState<Destination[]>([
    {
      id: "tam-dao",
      name: "Tam Đảo",
      description:
        "Discover the misty mountains and cool climate of Tam Đảo, a perfect retreat from the summer heat with breathtaking views.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      tripCount: 2,
    },
    {
      id: "ninh-binh",
      name: "Ninh Bình",
      description:
        "Explore the 'Halong Bay on Land' with its stunning limestone karsts, peaceful rivers, and ancient temples.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      tripCount: 2,
    },
    {
      id: "ha-long",
      name: "Hạ Long Bay",
      description:
        "Experience the UNESCO World Heritage site with thousands of limestone islands rising from emerald waters.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      tripCount: 1,
    },
    {
      id: "sapa",
      name: "Sapa",
      description:
        "Discover terraced rice fields, trek through stunning mountains, and experience ethnic minority cultures.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      tripCount: 1,
    },
  ]);

  // For demo purposes - toggle to show empty state
  const [showEmptyState, setShowEmptyState] = useState(false);
  const displayDestinations = showEmptyState ? [] : destinations;

  // Mock user booking for demo
  const [userBooking] = useState({
    destinationId: "tam-dao",
    tourId: "tam-dao-jun-20",
    startDate: "Jun 20, 2025",
    endDate: "Jun 22, 2025",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter destinations based on search
  const filteredDestinations = displayDestinations.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <main className="flex-1">
        {/* Hero section */}
        <div className="bg-primary/5 relative py-10 md:py-14">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            style={{ objectFit: "cover", zIndex: 0 }}
            priority
          />
          <div className="relative z-10 mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover Your Perfect Summer Journey
              </h1>
              <p className="text-muted-foreground mt-4">
                Explore beautiful destinations and book your company-sponsored
                summer trip
              </p>

              {userBooking && (
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="text-black">
                      You have an active booking for{" "}
                      <Link
                        href={`/destinations/${userBooking.destinationId}/tours/${userBooking.tourId}`}
                        className="font-medium underline underline-offset-4"
                      >
                        {
                          destinations.find(
                            (d) => d.id === userBooking.destinationId,
                          )?.name
                        }{" "}
                        ({userBooking.startDate} - {userBooking.endDate})
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="relative mt-6">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search destinations..."
                  className="bg-white pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Available Destinations
              </h2>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {filteredDestinations.length === 0 ? (
                searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-xl font-semibold">
                      No results found
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      {`We couldn't find any destinations matching "${searchQuery}
                      ". Try a different search term.`}
                    </p>
                  </div>
                ) : (
                  <EmptyState onToggle={() => setShowEmptyState(false)} />
                )
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredDestinations.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDestinations
                  .filter((d) => d.id === "tam-dao" || d.id === "ha-long")
                  .map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDestinations
                  .filter((d) => d.id === "ha-long" || d.id === "sapa")
                  .map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* For demo purposes - toggle button to show empty state */}
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-xs"
            >
              Toggle Empty State (Demo)
            </Button>
          </div>
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
          <div className="flex items-center gap-1 text-sm text-white/90">
            <span>{destination.tripCount} trips available</span>
          </div>
        </div>
        <Badge className="absolute top-3 right-3 z-20">Popular</Badge>
      </div>

      <CardContent className="p-4">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {destination.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/destinations/${destination.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Destination
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function EmptyState({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <div className="bg-primary/10 rounded-full p-3">
        <MapPin className="text-primary h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">No Destinations Available</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        There are currently no summer journey destinations available for
        registration. Please check back later or contact the HR department for
        more information.
      </p>
      <Button onClick={onToggle} className="mt-6">
        Check Available Destinations
      </Button>
    </div>
  );
}
