"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CRUDTemplate from "@/components/dashboard/crud-template";
import { useEffect, useState } from "react";
import { getRecords } from "@/components/dashboard/crud-service";
import { format } from "date-fns";
import { BookingFormValues, bookingSchema } from "@/schemas/booking";

const table = "bookings";
const model = "Booking";

const schema = bookingSchema;
type DefaultFormValues = BookingFormValues;

const defaultFormValues: DefaultFormValues = {
  id: "",
  booking_date: new Date(),
};

interface User {
  id: string;
  full_name: string;
}

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function loadTours() {
      try {
        const tours = await getRecords<User>("profiles");
        const options = tours.map((d) => ({
          value: d.id,
          label: d.full_name,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      }
    }

    loadTours();
  }, []);

  const headers = [
    {
      field: "user_id",
      title: "User",
      render: (value: unknown) => {
        return userOptions.find((option) => option.value === value)?.label;
      },
    },
    {
      field: "booking_date",
      title: "Booking Date",
      render: (value: unknown) => format(value as Date, "yyyy-MM-dd"),
    },
  ];

  const fields = [
    {
      name: "user_id",
      label: "User",
      component: "select",
      options: userOptions,
    },
    {
      name: "booking_date",
      label: "Booking Date",
      component: "date-picker",
    },
  ];

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
        {...methods}
      />
    </FormProvider>
  );
}
