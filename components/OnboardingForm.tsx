"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// 1. Định nghĩa schema validation với Zod
const onboardingSchema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  employeeId: z.string().min(1, "Mã số nhân viên là bắt buộc"),
  phone: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
  region: z.enum(["B", "T", "N"]),
  department: z.string().min(1, "Phòng ban là bắt buộc"),
  cccd: z
    .string()
    .min(9, "CCCD không hợp lệ")
    .regex(/^\d+$/, "CCCD chỉ được chứa số"),
  dob: z.string().min(1, "Ngày sinh là bắt buộc"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingForm() {
  const { user, isLoaded, update } = useUser();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      employeeId: "",
      phone: "",
      region: "B",
      department: "HR",
      cccd: "",
      dob: "",
    },
  });

  async function onSubmit(data: OnboardingFormValues) {
    try {
      await update({
        publicMetadata: {
          ...user?.publicMetadata,
          profileCompleted: true,
          ...data,
        },
      });
      router.replace("/app"); // Chuyển đến trang chính sau khi hoàn thành
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  }

  if (!isLoaded) return <p>Đang tải...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-6 rounded bg-white p-4 shadow"
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên *</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Employee ID */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã số nhân viên *</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại *</FormLabel>
              <FormDescription>Có sử dụng Zalo tham gia nhóm</FormDescription>
              <FormControl>
                <Input placeholder="0987654321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Region */}
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khu vực</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="T">T</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng ban</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CCCD */}
        <FormField
          control={form.control}
          name="cccd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCCD *</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DOB */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Hoàn thành đăng ký
        </Button>
      </form>
    </Form>
  );
}
