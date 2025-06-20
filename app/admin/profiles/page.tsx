"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProfileFormValues, profileSchema } from "@/schemas/profileSchema";
import CRUDTemplate from "@/components/dashboard/crud-template";
import { decryptData } from "@/components/confirm-info-form";

const table = "profiles";
const model = "Profile";

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
  {
    value: "phuquoc",
    label: "Phu Quoc",
  },
  {
    value: "foreign",
    label: "Foreign",
  },
];
const fields = [
  {
    name: "email",
    label: "Email",
    required: true,
  },
  {
    name: "full_name",
    label: "Full Name",
  },
  {
    name: "employee_code",
    label: "Employee Code",
  },
  {
    name: "department",
    label: "Department",
  },
  {
    name: "region",
    label: "Region",
    component: "select",
    options: regionOptions,
  },
];
const schema = profileSchema;
type DefaultFormValues = ProfileFormValues;
const defaultFormValues: DefaultFormValues = {
  email: "",
  full_name: "",
  employee_code: "",
  department: "",
  region: "north",
};

export default function Page() {
  const methods = useForm<DefaultFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  const headers = [
    {
      field: "email",
      title: "Email",
    },
    {
      field: "full_name",
      title: "Full Name",
    },
    {
      field: "employee_code",
      title: "Employee Code",
    },
    {
      field: "department",
      title: "Department",
    },
    {
      field: "region",
      title: "Region",
      render: (value: unknown) => {
        return regionOptions.find((option) => option.value === value)?.label;
      },
    },
    {
      field: "encrypted_personal_data",
      title: "Encrypted Personal Data",
      render: (value: unknown) => {
        type PersonalData = {
          idCardNumber: string;
          phoneNumber: string;
          dateOfBirth?: string;
          address: string;
        };
        const decrypted = decryptData(String(value)) as PersonalData | null;
        if (!decrypted) return "Không thể giải mã";

        const formattedDate = decrypted.dateOfBirth
          ? new Intl.DateTimeFormat("vi-VN").format(
              new Date(decrypted.dateOfBirth),
            )
          : "Không có ngày sinh";

        return (
          <div>
            <div>
              <strong>ID Card:</strong> {decrypted.idCardNumber}
            </div>
            <div>
              <strong>Phone:</strong> {decrypted.phoneNumber}
            </div>
            <div>
              <strong>Date of Birth:</strong> {formattedDate}
            </div>
            <div>
              <strong>Address:</strong> {decrypted.address}
            </div>
          </div>
        );
      },
    },

    {
      field: "is_vegetarian",
      title: "Vegetarian",
      render: (value: unknown) => {
        return value ? "Yes" : "No";
      },
    },
    {
      field: "has_heart_disease",
      title: "Heart Disease",
      render: (value: unknown) => {
        return value ? "Yes" : "No";
      },
    },
    {
      field: "special_health_notes",
      title: "Health Notes",
    },
    {
      field: "shirt_size",
      title: "Shirt Size",
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
