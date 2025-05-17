"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  isLoading?: boolean;
  className?: string;
  [key: string]: unknown;
}

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <FormProvider {...form}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-6">
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your login email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter your password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          {/* <CardFooter>
            <p className="text-muted-foreground w-full text-center text-xs">
              Default credentials: admin@example.com / admin123
            </p>
          </CardFooter> */}
        </Card>
      </div>
    </FormProvider>
  );
}
