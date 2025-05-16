"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DestinationFormValues,
  destinationSchema,
} from "@/schemas/destinationSchema";
import CRUDTemplate from "@/components/dashboard/crud-template";

const table = "destinations";
const model = "Destination";

const regionOptions = [
  {
    value: "north",
    label: "North",
  },
  {
    value: "central",
    label: "Central",
  },
  {
    value: "south",
    label: "South",
  },
];
const statusOptions = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];
const fields = [
  {
    name: "name",
    label: "Name",
  },
  {
    name: "description",
    label: "Description",
    component: "textarea",
  },
  {
    name: "region",
    label: "Region",
    component: "select",
    options: regionOptions,
  },
  {
    name: "status",
    label: "Status",
    component: "select",
    options: statusOptions,
  },
];
const schema = destinationSchema;
type DefaultFormValues = DestinationFormValues;
const defaultFormValues: DefaultFormValues = {
  name: "",
  description: "",
  region: "north",
  status: "active",
};

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const headers = [
    {
      field: "name",
      title: "Name",
    },
    {
      field: "description",
      title: "Description",
    },
    {
      field: "region",
      title: "Region",
      render: (value: string) => {
        return regionOptions.find((option) => option.value === value)?.label;
      },
    },
    {
      field: "status",
      title: "Status",
      render: (value: string) => {
        return statusOptions.find((option) => option.value === value)?.label;
      },
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
