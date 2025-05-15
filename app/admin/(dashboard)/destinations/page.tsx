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
const headers = [
  {
    field: "name",
    title: "Name",
    classNames: {
      tableCell: "font-medium break-all",
    },
  },
  {
    field: "description",
    title: "Description",
    classNames: {
      tableCell: "font-medium break-all",
    },
  },
  {
    field: "status",
    title: "Status",
    classNames: {
      tableCell: "font-medium break-all",
    },
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
    name: "status",
    label: "Status",
    component: "select",
    options: [
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
    ],
  },
];
const schema = destinationSchema;
type DefaultFormValues = DestinationFormValues;
const defaultFormValues: DefaultFormValues = {
  name: "",
  description: "",
  status: "active",
};

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

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
