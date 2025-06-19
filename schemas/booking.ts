import { z } from "zod";

export const bookingSchema = z.object({
  full_name: z.string().nullable().optional(),
  booking_date: z.coerce.date({
    required_error: "startDate is required",
    invalid_type_error: "startDate must be a valid date",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
