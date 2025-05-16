import { z } from "zod";

export const tourSchema = z
  .object({
    destination_id: z.string().uuid({
      message: "destinationId must be a valid UUID",
    }),
    start_date: z.coerce.date({
      required_error: "startDate is required",
      invalid_type_error: "startDate must be a valid date",
    }),
    end_date: z.coerce.date({
      required_error: "endDate is required",
      invalid_type_error: "endDate must be a valid date",
    }),
    capacity: z.coerce.number().min(1, "capacity must be at least 1"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "endDate must be greater than or equal to startDate",
    path: ["end_date"],
  });

export type TourFormValues = z.infer<typeof tourSchema>;
