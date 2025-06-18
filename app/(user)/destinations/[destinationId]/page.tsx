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
import { ChevronRight, Info, Loader2, LoaderCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useBooking } from "@/contexts/booking-context";
import { useUserProfile } from "@/contexts/user-context";
import TourDateCard, {
  RegisteredUser,
  TourDate,
} from "@/components/tour-date-card";
import ninhBinhInfographicImage from "../../../../public/ninh-binh-infographic.jpg";

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

export default function DestinationPage() {
  const supabase = createClient();

  const user = useUserProfile();
  const params = useParams();
  const { booking, fetchMyBooking } = useBooking();
  const destinationId = params.destinationId as string;

  // State
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const currentUserId = user?.profile?.id || "demo-user-id";

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
        setError("Không thể tải đích");
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
        setError("Đã xảy ra lỗi không mong muốn");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId, supabase, user]);

  const handleBooking = async (tourId: string) => {
    const hasExistingBooking = tourDates.some((date) => date.isUserRegistered);

    if (hasExistingBooking) {
      alert(
        "Bạn đã có đặt chỗ đang hoạt động. Vui lòng hủy trước khi đặt chuyến đi mới.",
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
        toast.error("Cập nhật hồ sơ không thành công", {
          description: "Yêu cầu xác thực người dùng",
        });
        setIsBookingLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.rpc("book_tour_atomic", {
        p_tour_id: selectedTourId,
        p_user_id: user?.profile?.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Đặt chỗ thành công!");
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
        toast.error("Cập nhật hồ sơ không thành công", {
          description: "Yêu cầu xác thực người dùng",
        });
        setIsCancelLoading(false);
        return;
      }

      const { error } = await supabase.rpc("cancel_booking_atomic", {
        p_booking_id: selectedBookingId,
        p_user_id: user?.profile?.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Đã hủy đặt phòng thành công!");
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
        .select("id, full_name, department")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        setSelectedTourUsers([]);
        return null;
      }

      // 4. Create a map for quick profile lookup by user_id
      const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // 5. Merge bookings with corresponding profiles and map to user info
      const users = bookings.map((booking) => {
        const profile = profilesMap.get(booking.user_id);
        return {
          id: profile?.id || null,
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
          Thử lại
        </Button>
      </div>
    );
  }

  if (!destination) {
    return null;
  }

  return (
    <>
      <div
        className="relative bg-black"
        style={{
          backgroundImage: `url('/ninh-binh-banner2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative h-[35vh] overflow-hidden md:h-[40vh] lg:h-[45vh]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 z-20 mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-white/80">
                  <Link href="/" className="hover:text-white">
                    Trang chủ
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
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">
                  Đôi nét về {destination.name}
                </h2>
                <p className="text-muted-foreground">
                  {destination.description}
                </p>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">
                  Lịch trình chuyến đi
                </h2>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={
                      ninhBinhInfographicImage ??
                      (destination.infographicUrl || "/placeholder.svg")
                    }
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
                    Chọn Ngày khởi hành
                  </h3>
                  {tourDates.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">
                        Không có ngày nào có sẵn cho điểm đến này.
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
                    <h4 className="font-medium">Lưu ý</h4>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Hạn chót đăng ký: 2 tuần trước khi khởi hành
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Có thể hủy trước 1 tuần so với ngày khởi hành
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Bạn chỉ có thể đặt một chuyến đi tại một thời điểm
                        </span>
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
            <DialogTitle>Xác nhận Đăng ký</DialogTitle>
            <DialogDescription>
              Bạn chắc chắn muốn chọn chuyến đi này chứ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
            >
              Chọn lại
            </Button>
            <Button onClick={confirmBooking} disabled={isBookingLoading}>
              {isBookingLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy Đăng ký</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đăng ký chuyến đi này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={isCancelLoading}
            >
              {isCancelLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Xác nhận hủy
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
            <DialogTitle>Thành viên tham gia đã đăng ký</DialogTitle>
            <DialogDescription>
              {selectedTourUsers.length} thành viên đã đăng ký cho chuyến đi
              này.
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
                          Bạn
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
