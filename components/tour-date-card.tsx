import React from "react";

import { Clock, Users, Calendar } from "lucide-react";
import { formatDateRange } from "@/lib/dateUtils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export type RegisteredUser = {
  id: string;
  name: string;
  // avatar: string;
  department: string;
};

export type TourDate = {
  id: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  registered: number;
  capacity: number;
  isUserRegistered?: boolean;
  registeredUsers?: RegisteredUser[];
};

function getDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export default function TourDateCard({
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
              {getDurationDays(tourDate.startDate, tourDate.endDate)} ngày
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Số lượng thành viên: {tourDate.capacity}
            </span>
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            {tourDate.capacity - tourDate.registered === 0
              ? "Không có chỗ trống"
              : `${tourDate.capacity - tourDate.registered} chỗ trống có sẵn`}
          </div>
        </div>
        {isFullyBooked && <Badge variant="destructive">Full</Badge>}
        {isUserBooking && (
          <Badge variant="outline" className="border-primary text-primary">
            Đã đặt chỗ
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
            className="min-w-0 flex-1"
            disabled={tourDate.registered === 0}
          >
            <Users className="mr-1 h-4 w-4" />
            <span className="overflow-hidden whitespace-nowrap text-ellipsis block max-w-full">
              {tourDate.registered} Thành viên đã đăng ký
            </span>
          </Button>
          {isUserBooking ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={onCancel}
              className="min-w-0 flex-1"
            >
              Hủy đặt chỗ
            </Button>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onBook}
              disabled={isFullyBooked || hasBooked}
              className="min-w-0 flex-1"
            >
              Đặt ngay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
