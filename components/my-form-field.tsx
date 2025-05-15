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
            <FormLabel htmlFor={name}>{label}</FormLabel>
          ) : null}
          {component === "select" ? (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified email to display" />
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
