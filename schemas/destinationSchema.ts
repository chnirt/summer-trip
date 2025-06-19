import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail_url: z.string().url("Invalid URL format").nullable().optional(),
  trip_url: z.string().url("Invalid URL format").nullable().optional(),
  youtube_url: z.string().url("Invalid URL format").nullable().optional(),
  region: z.enum(["north", "central", "south", "phuquoc", "foreign"], {
    errorMap: () => ({
      message: "Region must be one of: north, central, south, phuquoc, foreign",
    }),
  }),
  status: z.enum(["active", "draft", "inactive"], {
    errorMap: () => ({
      message: "Status must be one of: active, draft, inactive",
    }),
  }),
});

export type DestinationFormValues = z.infer<typeof destinationSchema>;
