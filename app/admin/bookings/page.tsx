"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CRUDTemplate from "@/components/dashboard/crud-template";
import { format } from "date-fns";
import { BookingFormValues, bookingSchema } from "@/schemas/booking";
import { createClient } from "@/utils/supabase/client";

const table = "bookings";
const model = "Booking";

const schema = bookingSchema;
type DefaultFormValues = BookingFormValues;

const defaultFormValues: DefaultFormValues = {
  full_name: "",
  booking_date: new Date(),
};

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const headers = [
    {
      field: "profiles.full_name",
      title: "Full Name",
    },
    {
      field: "booking_date",
      title: "Booking Date",
      render: (value: unknown) => format(value as Date, "yyyy-MM-dd"),
    },
  ];

  const fields = [
    {
      name: "full_name",
      label: "Full Name",
    },
    {
      name: "booking_date",
      label: "Booking Date",
      component: "date-picker",
    },
  ];

  const supabase = createClient();

  const fetchBookingData = async ({
    from,
    to,
  }: {
    from: number;
    to: number;
  }) => {
    const { data, error, count } = await supabase
      .from("bookings")
      .select(
        `
          id,
          tour_id,
          user_id,
          booking_date,
          profiles (
            full_name
          )
        `,
      )
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], count };
  };

  return (
    <FormProvider {...methods}>
      <CRUDTemplate
        table={table}
        model={model}
        defaultFormValues={defaultFormValues}
        headers={headers}
        fields={fields}
        actions={[
          {
            key: "delete",
          },
        ]}
        canCreate={false}
        fetcher={fetchBookingData}
        {...methods}
      />
    </FormProvider>
  );
}
