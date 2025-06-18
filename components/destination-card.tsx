import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

// Types
export type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
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
