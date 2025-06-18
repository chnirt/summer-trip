import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string().min(1, "User Id is required"),
  booking_date: z.coerce.date({
    required_error: "startDate is required",
    invalid_type_error: "startDate must be a valid date",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
