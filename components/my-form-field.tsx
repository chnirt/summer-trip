import { HTMLInputTypeAttribute, JSX } from "react";
import { Control, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import FileUploadInput from "./file-upload-input";

type Option = {
  value: string;
  label: string;
};

type Options = Option[];

type MyFormFieldProps = {
  control?: Control<FieldValues, unknown, FieldValues> | undefined;
  name: string;
  type?: HTMLInputTypeAttribute | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  renderLabel?: () => JSX.Element;
  component?: string;
  options?: Options;
  required?: boolean;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MyFormField({
  control,
  name,
  type = "text",
  label,
  placeholder,
  renderLabel,
  component = "input",
  options,
  required = false,
  uploading,
  setUploading,
}: MyFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {typeof renderLabel === "function" ? (
            renderLabel()
          ) : label ? (
            <FormLabel htmlFor={name}>
              {label}{" "}
              {required ? <span className="text-red-500">*</span> : null}
            </FormLabel>
          ) : null}
          {component === "file" ? (
            <FormControl>
              <FileUploadInput
                id={name}
                uploading={uploading}
                setUploading={setUploading}
                {...field}
              />
            </FormControl>
          ) : component === "number" ? (
            <FormControl>
              <Input
                id={name}
                type="number"
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
          ) : component === "date-picker" ? (
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
                      <span>Select date</span>
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
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          ) : component === "select" ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options?.map((option, oi) => (
                  <SelectItem key={[oi].join("-")} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : component === "textarea" ? (
            <FormControl>
              <Textarea id={name} placeholder={placeholder} {...field} />
            </FormControl>
          ) : (
            <FormControl>
              <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
