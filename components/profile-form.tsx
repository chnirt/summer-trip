"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { DatePicker } from "./date-picker";

// Define the form validation schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  employeeId: z.string().min(1, {
    message: "Employee ID is required.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  region: z.string({
    required_error: "Please select an region.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
  idCardNumber: z.string().min(9, {
    message: "ID card number must be at least 9 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
});

// Define the form values type
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      employeeId: "",
      phoneNumber: "",
      idCardNumber: "",
      department: "HR",
      region: "north",

      // fullName: "aa",
      // employeeId: "1",
      // phoneNumber: "1111111111",
      // region: "north",
      // department: "HR",
      // idCardNumber: "111111111",
      // dateOfBirth: new Date("2025-04-30T17:00:00.000Z"),
    },
  });

  async function onSubmit(formData: ProfileFormValues) {
    // Reset error state
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("Profile update failed", {
          description: "User authentication required",
        });
        return;
      }

      // Format data for Supabase
      const profileData = {
        user_id: user.id,
        full_name: formData.fullName,
        employee_id: formData.employeeId,
        phone_number: formData.phoneNumber,
        region: formData.region,
        department: formData.department,
        id_card_number: formData.idCardNumber,
        date_of_birth: formData.dateOfBirth,
      };

      // Submit to Supabase
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) {
        toast.error("Profile update failed", {
          description: error.message,
        });
        return;
      }

      toast.success("Profile completed!", {
        description: "Your profile has been saved. Welcome aboard!",
        duration: 3000,
      });

      // Redirect to main page on success
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      toast.error("Profile update failed", {
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Redirect if user is not authenticated
  useEffect(() => {
    // Only check profile if user is loaded and authenticated
    if (isUserLoaded && user) {
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            // Profile exists, redirect to home (or dashboard)
            router.replace("/");
          } else {
            // No profile, allow form to render
            setCheckingProfile(false);
          }
        });
    } else if (isUserLoaded && !user) {
      router.replace("/");
    }
  }, [isUserLoaded, user, router]);

  // Show loading state while checking user authentication
  if (!isUserLoaded || checkingProfile) {
    return (
      <Card className="w-full">
        <CardContent className="flex min-h-[200px] items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Loading user information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          Welcome!
        </CardTitle>
        <CardDescription className="text-center">
          Please complete your profile to get started with our app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employee ID <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This phone number will be used for Zalo group
                      participation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ID Card Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your ID card number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Required for insurance registration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <DatePicker {...field} saveAsUTC={true} error={!!error} />
                    <FormDescription>
                      Required for insurance registration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
