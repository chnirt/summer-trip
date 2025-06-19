import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

// Types
export type Destination = {
  id: string;
  name: string;
  description: string;
  thumbnail_url?: string;
  trip_count: number;
  region: string;
};

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <Card className="group overflow-hidden py-0 transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
        {destination.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.thumbnail_url}
            alt={destination.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : null}
        <div className="absolute bottom-3 left-3 z-20">
          <h3 className="text-lg font-semibold text-white">
            {destination.name}
          </h3>
          {destination.trip_count > 0 ? (
            <div className="flex items-center gap-1 text-sm text-white/90">
              <span>{destination.trip_count} chuyến đi có sẵn</span>
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
            Xem & Đăng ký
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
