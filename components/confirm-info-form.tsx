import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { useUserProfile } from "@/contexts/user-context";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

// Hàm mã hóa giả lập
function encryptData(data: object): string {
  const jsonString = JSON.stringify(data);
  // Encode JSON string sang UTF-8 bytes
  const utf8Bytes = new TextEncoder().encode(jsonString);
  // Chuyển Uint8Array sang Base64
  const base64String = btoa(String.fromCharCode(...utf8Bytes));
  return base64String;
}

// Việt hóa thông báo lỗi
const profileFormSchema = z
  .object({
    email: z.string().email("Email không hợp lệ."),
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự."),
    employeeCode: z.string().min(1, "Mã nhân viên là bắt buộc."),
    department: z.string(),
    region: z.enum(["north", "central", "south", "phuquoc", "foreign"], {
      required_error: "Vui lòng chọn khu vực.",
    }),
    idCardNumber: z.string().min(9, "Số CCCD phải có ít nhất 9 ký tự."),
    phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 số."),
    dateOfBirth: z.date({ required_error: "Vui lòng chọn ngày sinh." }),
    address: z.string().min(5, "Địa chỉ không được để trống."),
    isVegetarian: z.enum(["yes", "no"], {
      required_error: "Vui lòng chọn đáp án.",
    }),
    hasHeartDisease: z.enum(["yes", "no"], {
      required_error: "Vui lòng chọn đáp án.",
    }),
    specialHealthNotes: z.string().max(500).optional(),
    shirtSize: z.enum(["S", "M", "L", "XL", "XXL"], {
      required_error: "Vui lòng chọn size áo.",
    }),
  })
  .superRefine(({ hasHeartDisease, specialHealthNotes }, ctx) => {
    if (
      hasHeartDisease === "yes" &&
      (!specialHealthNotes || specialHealthNotes.trim() === "")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["specialHealthNotes"],
        message:
          "Vui lòng cung cấp các lưu ý đặc biệt khi bạn có vấn đề sức khỏe.",
      });
    }
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserProfile();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      employeeCode: "",
      department: "",
      region: "north",
      idCardNumber: "",
      phoneNumber: "",
      dateOfBirth: undefined,
      address: "",
      isVegetarian: undefined,
      hasHeartDisease: undefined,
      specialHealthNotes: undefined,
      shirtSize: undefined,
    },
  });

  const hasHeartDisease = form.watch("hasHeartDisease");

  useEffect(() => {
    if (user?.profile) {
      form.reset(
        {
          email: user?.profile?.email,
          fullName: user?.profile?.full_name,
          employeeCode: user?.profile?.employee_code,
          department: user?.profile?.department,
          region: user?.profile?.region,

          // idCardNumber: "",
          // phoneNumber: "",
          // dateOfBirth: undefined,
          // address: "",
          // isVegetarian: undefined,
          // hasHeartDisease: undefined,
          // shirtSize: undefined,

          // idCardNumber: "111111111",
          // phoneNumber: "1111111111",
          // address: "11111",
          // isVegetarian: "yes",
          // hasHeartDisease: "no",
        },
        { keepDefaultValues: true },
      );
      setIsLoading(false);
    }
  }, [form, user]);

  async function onSubmit(formData: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const encrypted_personal_data = encryptData({
        idCardNumber: formData.idCardNumber,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      });

      const profileData = {
        email: formData.email,
        // full_name: formData.fullName,
        // employee_code: formData.employeeCode,
        // department: formData.department,
        // region: formData.region,
        encrypted_personal_data,
        is_vegetarian: formData.isVegetarian === "yes",
        has_heart_disease: formData.hasHeartDisease === "yes",
        special_health_notes: formData.specialHealthNotes,
        shirt_size: formData.shirtSize,
        is_confirmed: true,
      };

      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "email" });

      if (error) {
        toast.error("Lưu hồ sơ thất bại", {
          description: error.message,
        });
        return;
      }

      toast.success("Hoàn tất hồ sơ!", {
        description: "Hồ sơ của bạn đã được lưu thành công.",
        duration: 3000,
      });

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      toast.error("Lưu hồ sơ thất bại", {
        description: `Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          Chào mừng Anh/Chị!
        </CardTitle>
        <CardDescription className="text-center">
          Vui lòng kiểm tra thông tin & đăng ký chuyến đi Happy Trip -
          Togetherness 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Họ tên */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Mã nhân viên */}
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phòng ban */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng ban</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Khu vực */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Khu vực</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn khu vực" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="north">Miền Bắc</SelectItem>
                            <SelectItem value="central">Miền Trung</SelectItem>
                            <SelectItem value="south">Miền Nam</SelectItem>
                            <SelectItem value="phuquoc">Phú Quốc</SelectItem>
                            <SelectItem value="foreign">Nước ngoài</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {/* Số CCCD */}
                <FormField
                  control={form.control}
                  name="idCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số CCCD <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số căn cước công dân"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Số điện thoại */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số điện thoại <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormDescription>
                        Vui lòng cung cấp SĐT có sử dụng Zalo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Ngày sinh */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày sinh <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Địa chỉ */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Câu hỏi 1: Ăn chay */}
                <FormField
                  control={form.control}
                  name="isVegetarian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bạn có ăn chay không?{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-6"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="heart-yes" />
                            <FormLabel
                              htmlFor="heart-yes"
                              className="cursor-pointer"
                            >
                              Có
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="heart-no" />
                            <FormLabel
                              htmlFor="heart-no"
                              className="cursor-pointer"
                            >
                              Không
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Câu hỏi 2: Bệnh tim mạch */}
                <FormField
                  control={form.control}
                  name="hasHeartDisease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Bạn có mắc bệnh/triệu chứng về tim mạch hoặc vấn đề sức
                        khỏe đặc biệt cần lưu ý không?{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-6"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="heart-yes" />
                            <FormLabel
                              htmlFor="heart-yes"
                              className="cursor-pointer"
                            >
                              Có
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="heart-no" />
                            <FormLabel
                              htmlFor="heart-no"
                              className="cursor-pointer"
                            >
                              Không
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Trường lưu ý đặc biệt chỉ hiển thị khi chọn "Có" */}
                {hasHeartDisease === "yes" && (
                  <FormField
                    control={form.control}
                    name="specialHealthNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Lưu ý đặc biệt về sức khỏe{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Vui lòng cung cấp các lưu ý đặc biệt"
                            className="w-full rounded-md border border-gray-300 p-2"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* Câu hỏi 3: Size áo */}
                <FormField
                  control={form.control}
                  name="shirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Size áo <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        key="shirtSize"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Hoàn tất hồ sơ"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
