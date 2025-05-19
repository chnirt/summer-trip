import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

async function getCount(tableName: string, from?: Date, to?: Date) {
  let query = supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });
  if (from) query = query.gte("created_at", from.toISOString());
  if (to) query = query.lt("created_at", to.toISOString());
  const { count, error } = await query;
  if (error) {
    console.error(`Error counting ${tableName}:`, error);
    return 0;
  }
  return count ?? 0;
}

function calcGrowthPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function SectionCards() {
  const [stats, setStats] = useState({
    totalUsersCurrent: 0,
    totalUsersPrevious: 0,
    totalDestinationsCurrent: 0,
    totalDestinationsPrevious: 0,
    totalToursCurrent: 0,
    totalToursPrevious: 0,
    currentBookingCount: 0,
    previousBookingCount: 0,
  });

  const fetchStats = useCallback(async () => {
    const monthsBack = 6;
    const now = new Date();

    // Khoảng thời gian hiện tại và trước đó
    const currentFromDate = new Date(now);
    currentFromDate.setMonth(currentFromDate.getMonth() - monthsBack);

    const previousFromDate = new Date(now);
    previousFromDate.setMonth(previousFromDate.getMonth() - monthsBack * 2);

    const previousToDate = new Date(now);
    previousToDate.setMonth(previousToDate.getMonth() - monthsBack);

    // Lấy dữ liệu current và previous cho từng bảng
    const [
      totalUsersCurrent,
      totalUsersPrevious,
      totalDestinationsCurrent,
      totalDestinationsPrevious,
      totalToursCurrent,
      totalToursPrevious,
      currentBookingCount,
      previousBookingCount,
    ] = await Promise.all([
      getCount("profiles", currentFromDate),
      getCount("profiles", previousFromDate, previousToDate),
      getCount("destinations", currentFromDate),
      getCount("destinations", previousFromDate, previousToDate),
      getCount("tours", currentFromDate),
      getCount("tours", previousFromDate, previousToDate),
      getCount("bookings", currentFromDate),
      getCount("bookings", previousFromDate, previousToDate),
    ]);

    setStats({
      totalUsersCurrent,
      totalUsersPrevious,
      totalDestinationsCurrent,
      totalDestinationsPrevious,
      totalToursCurrent,
      totalToursPrevious,
      currentBookingCount,
      previousBookingCount,
    });
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Tạo mảng cấu hình các card
  const cards = [
    {
      key: "users",
      title: "Total Users",
      currentValue: stats.totalUsersCurrent,
      previousValue: stats.totalUsersPrevious,
      description: "Total registered users over the last 6 months",
    },
    {
      key: "destinations",
      title: "Destinations",
      currentValue: stats.totalDestinationsCurrent,
      previousValue: stats.totalDestinationsPrevious,
      description: "Destinations added in the last 6 months",
    },
    {
      key: "tours",
      title: "Tours",
      currentValue: stats.totalToursCurrent,
      previousValue: stats.totalToursPrevious,
      description: "Tours available in the last 6 months",
    },
    {
      key: "bookings",
      title: "Bookings",
      currentValue: stats.currentBookingCount,
      previousValue: stats.previousBookingCount,
      description: "Booking count over the last 6 months",
      // bookingPercent: booking count / total tours current
      percentOfTotalTours:
        stats.totalToursCurrent > 0
          ? (stats.currentBookingCount / stats.totalToursCurrent) * 100
          : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {cards.map((card) => {
        const growthPercent = calcGrowthPercent(
          card.currentValue,
          card.previousValue,
        );
        const isPositive = growthPercent >= 0;
        return (
          <Card key={card.key} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.key === "bookings"
                  ? `${(card.percentOfTotalTours || 0).toFixed(2)}%`
                  : card.currentValue}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? <IconTrendingUp /> : <IconTrendingDown />}
                  {isPositive ? "+" : ""}
                  {growthPercent.toFixed(2)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex items-center gap-2 font-medium">
                {isPositive ? "Trending up" : "Trending down"} this period{" "}
                {isPositive ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">{card.description}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
