import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  region: z.enum(["north", "central", "south"], {
    errorMap: () => ({
      message: "Region must be one of: north, central, south",
    }),
  }),
  status: z.enum(["active", "draft", "inactive"], {
    errorMap: () => ({
      message: "Status must be one of: active, draft, inactive",
    }),
  }),
});

export type DestinationFormValues = z.infer<typeof destinationSchema>;
