"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { tourSchema, TourFormValues } from "@/schemas/tourSchema"; // giả sử bạn lưu schema ở đây
import CRUDTemplate from "@/components/dashboard/crud-template";
import { useEffect, useState } from "react";
import { getRecords } from "@/components/dashboard/crud-service";

const table = "tours";
const model = "Tour";

const schema = tourSchema;
type DefaultFormValues = TourFormValues;

const defaultFormValues: DefaultFormValues = {
  destination_id: "",
  start_date: new Date(), // "yyyy-MM-dd"
  end_date: new Date(),
  capacity: 1,
};

interface Destination {
  id: string;
  name: string;
}

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const [destinationOptions, setDestinationOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const destinations = await getRecords<Destination>("destinations");
        const options = destinations.map((d) => ({
          value: d.id,
          label: d.name,
        }));
        setDestinationOptions(options);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    }

    loadDestinations();
  }, []);

  const headers = [
    {
      field: "destination_id",
      title: "Destination",
      render: (value: unknown) => {
        return destinationOptions.find((option) => option.value === value)
          ?.label;
      },
    },
    {
      field: "start_date",
      title: "Start Date",
    },
    {
      field: "end_date",
      title: "End Date",
    },
    {
      field: "registered",
      title: "Registered",
    },
    {
      field: "capacity",
      title: "Capacity",
    },
  ];

  const fields = [
    {
      name: "destination_id",
      label: "Destination",
      component: "select",
      options: destinationOptions,
      required: true,
    },
    {
      name: "start_date",
      label: "Start Date",
      component: "date-picker",
    },
    {
      name: "end_date",
      label: "End Date",
      component: "date-picker",
    },
    {
      name: "capacity",
      label: "Capacity",
      component: "number",
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
        {...methods}
      />
    </FormProvider>
  );
}
