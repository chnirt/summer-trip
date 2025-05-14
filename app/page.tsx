"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Users, MapPin, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignedIn, UserButton } from "@clerk/nextjs";

type Journey = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  registered: number;
  capacity: number;
  isUserRegistered?: boolean;
};

type Participant = {
  id: string;
  name: string;
  department: string;
};

export default function SummerJourneyRegistration() {
  const [journeys, setJourneys] = useState<Journey[]>([
    {
      id: "1",
      destination: "Tam Đảo",
      startDate: "Jun 20",
      endDate: "Jun 22, 2025",
      registered: 10,
      capacity: 80,
      isUserRegistered: true,
    },
    {
      id: "2",
      destination: "Ninh Bình",
      startDate: "Jun 20",
      endDate: "Jun 22, 2025",
      registered: 0,
      capacity: 90,
    },
    {
      id: "3",
      destination: "Tam Đảo",
      startDate: "Jul 4",
      endDate: "Jul 6, 2025",
      registered: 0,
      capacity: 80,
    },
    {
      id: "4",
      destination: "Ninh Bình",
      startDate: "Jul 4",
      endDate: "Jul 6, 2025",
      registered: 90,
      capacity: 90, // Fully booked example
    },
  ]);

  // For demo purposes - toggle to show empty state
  const [showEmptyState, setShowEmptyState] = useState(false);
  const displayJourneys = showEmptyState ? [] : journeys;

  // State for registration dialog
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

  // State for cancellation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // State for participants modal
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [currentJourneyId, setCurrentJourneyId] = useState<string | null>(null);

  // Check if user has any active booking
  const hasActiveBooking = journeys.some((journey) => journey.isUserRegistered);

  // Get the ID of the currently booked trip (if any)
  const bookedTripId = journeys.find((journey) => journey.isUserRegistered)?.id;

  // Mock participants data
  const mockParticipants: Record<string, Participant[]> = {
    "1": [
      { id: "p1", name: "Nguyen Van A", department: "HR" },
      { id: "p2", name: "Tran Thi B", department: "Marketing" },
      { id: "p3", name: "Le Van C", department: "IT" },
      { id: "p4", name: "Pham Thi D", department: "Finance" },
      { id: "p5", name: "Hoang Van E", department: "Operations" },
      { id: "p6", name: "Vu Thi F", department: "Sales" },
      { id: "p7", name: "Do Van G", department: "Customer Support" },
      { id: "p8", name: "Nguyen Thi H", department: "HR" },
      { id: "p9", name: "Tran Van I", department: "IT" },
      { id: "p10", name: "Le Thi J", department: "Marketing" },
    ],
    "2": [
      { id: "p11", name: "Nguyen Van K", department: "Finance" },
      { id: "p12", name: "Tran Thi L", department: "HR" },
    ],
    "3": [
      { id: "p13", name: "Le Van M", department: "IT" },
      { id: "p14", name: "Pham Thi N", department: "Marketing" },
      { id: "p15", name: "Hoang Van O", department: "Operations" },
    ],
    "4": Array.from({ length: 90 }, (_, i) => ({
      id: `p${i + 16}`,
      name: `Participant ${i + 1}`,
      department: ["HR", "IT", "Marketing", "Finance", "Operations", "Sales"][
        i % 6
      ],
    })),
  };

  const handleRegisterClick = (journey: Journey) => {
    setSelectedJourney(journey);
    setRegisterDialogOpen(true);
  };

  const handleCancelClick = (journey: Journey) => {
    setSelectedJourney(journey);
    setCancelDialogOpen(true);
  };

  const handleViewParticipants = (journeyId: string) => {
    setCurrentJourneyId(journeyId);
    setParticipantsModalOpen(true);
  };

  const confirmRegistration = () => {
    if (selectedJourney) {
      setJourneys(
        journeys.map((journey) =>
          journey.id === selectedJourney.id
            ? {
                ...journey,
                registered: journey.registered + 1,
                isUserRegistered: true,
              }
            : journey,
        ),
      );
    }
    setRegisterDialogOpen(false);
  };

  const confirmCancellation = () => {
    if (selectedJourney) {
      setJourneys(
        journeys.map((journey) =>
          journey.id === selectedJourney.id
            ? {
                ...journey,
                registered: Math.max(0, journey.registered - 1),
                isUserRegistered: false,
              }
            : journey,
        ),
      );
    }
    setCancelDialogOpen(false);
  };

  return (
    <div className="mx-auto flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold">Summer Journey Registration</h1>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {hasActiveBooking && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p>
                You have an active booking for{" "}
                <span className="font-medium">
                  {journeys.find((j) => j.isUserRegistered)?.destination}
                </span>
                . You must cancel this booking before registering for another
                trip.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {displayJourneys.length === 0 ? (
          <EmptyState onToggle={() => setShowEmptyState(false)} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayJourneys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onRegister={handleRegisterClick}
                onCancel={handleCancelClick}
                onViewParticipants={handleViewParticipants}
                hasActiveBooking={hasActiveBooking}
                bookedTripId={bookedTripId}
              />
            ))}
          </div>
        )}

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
      </main>

      <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
        © 2025 Company Summer Trips. All rights reserved.
      </footer>

      {/* Registration Confirmation Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>
              Are you sure you want to register for the trip to{" "}
              <span className="font-medium">
                {selectedJourney?.destination}
              </span>{" "}
              from{" "}
              <span className="font-medium">
                {selectedJourney?.startDate} to {selectedJourney?.endDate}
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
            <Button onClick={confirmRegistration}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for the trip to{" "}
              <span className="font-medium">
                {selectedJourney?.destination}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Registration</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancellation}
              className="bg-destructive hover:bg-destructive text-white"
            >
              Yes, Cancel Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Participants Modal */}
      <Dialog
        open={participantsModalOpen}
        onOpenChange={setParticipantsModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registered Participants</DialogTitle>
            <DialogDescription>
              {currentJourneyId && mockParticipants[currentJourneyId]?.length}{" "}
              people have registered for this journey
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-2">
              {currentJourneyId &&
                mockParticipants[currentJourneyId]?.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center">
                      <p className="font-medium">{participant.name}</p>
                    </div>
                    <div>
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                        {participant.department}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JourneyCard({
  journey,
  onRegister,
  onCancel,
  onViewParticipants,
  hasActiveBooking,
  bookedTripId,
}: {
  journey: Journey;
  onRegister: (journey: Journey) => void;
  onCancel: (journey: Journey) => void;
  onViewParticipants: (journeyId: string) => void;
  hasActiveBooking: boolean;
  bookedTripId: string | undefined;
}) {
  // Check if this journey is fully booked
  const isFullyBooked = journey.registered >= journey.capacity;

  // Check if user can book this trip
  const canBookTrip = !hasActiveBooking || journey.id === bookedTripId;

  // Get booking button status message
  const getBookingStatusMessage = () => {
    if (isFullyBooked) return "This trip is fully booked";
    if (hasActiveBooking && journey.id !== bookedTripId)
      return "You must cancel your current booking before registering for another trip";
    return "";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{journey.destination}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {journey.registered}/{journey.capacity}
            </span>
            {isFullyBooked && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                Full
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-2">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {journey.startDate}–{journey.endDate}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span>
            {journey.capacity - journey.registered === 0
              ? "No spots available"
              : `${journey.capacity - journey.registered} spots available`}
          </span>
        </div>

        {/* Progress bar for capacity */}
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className={`h-full ${isFullyBooked ? "bg-red-500" : journey.registered > journey.capacity * 0.7 ? "bg-amber-500" : "bg-green-500"}`}
            style={{
              width: `${Math.min((journey.registered / journey.capacity) * 100, 100)}%`,
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col justify-between gap-2 pt-2 sm:flex-row">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => onViewParticipants(journey.id)}
        >
          <Users className="mr-2 h-4 w-4" />
          View Participants
        </Button>

        {journey.isUserRegistered ? (
          <Button
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onCancel(journey)}
          >
            Cancel
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full sm:w-auto">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => onRegister(journey)}
                    disabled={isFullyBooked || !canBookTrip}
                  >
                    {isFullyBooked ? "Full" : "Book"}
                  </Button>
                </div>
              </TooltipTrigger>
              {(isFullyBooked || !canBookTrip) && (
                <TooltipContent>
                  <p>{getBookingStatusMessage()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
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
      <h2 className="mt-4 text-xl font-semibold">No Journeys Available</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        There are currently no summer journeys available for registration.
        Please check back later or contact the HR department for more
        information.
      </p>
      <Button onClick={onToggle} className="mt-6">
        Check Available Journeys
      </Button>
    </div>
  );
}
