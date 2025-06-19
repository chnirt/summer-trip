import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  full_name: z.string().nullable().optional(),
  employee_code: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  region: z.enum(["north", "central", "south", "phuquoc", "foreign"], {
    errorMap: () => ({
      message: "Region must be one of: north, central, south, phuquoc, foreign",
    }),
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
