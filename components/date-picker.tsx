"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  // Add option to specify how to handle timezone
  saveAsUTC?: boolean;
  error?: string | boolean;
}

export function DatePicker({
  value,
  onChange,
  className,
  saveAsUTC = false,
  error,
}: DatePickerProps) {
  const [month, setMonth] = React.useState<number>(
    value ? value.getMonth() : new Date().getMonth(),
  );
  const [year, setYear] = React.useState<number>(
    value ? value.getFullYear() : new Date().getFullYear(),
  );

  // Create list of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create list of years (from current year - 100 to current year + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i);

  // Update month and year when date changes
  React.useEffect(() => {
    if (value) {
      setMonth(value.getMonth());
      setYear(value.getFullYear());
    }
  }, [value]);

  // Function to handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && saveAsUTC) {
      // If we want to save as UTC, adjust the date to preserve the local date
      // This ensures that when the date is converted to UTC, it will still represent
      // the same calendar date the user selected
      const offset = selectedDate.getTimezoneOffset() * 60000; // offset in milliseconds
      const adjustedDate = new Date(selectedDate.getTime() - offset);
      onChange(adjustedDate);
    } else {
      onChange(selectedDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error &&
                "border-destructive text-destructive focus-visible:ring-destructive hover:bg-destructive/10 hover:text-destructive/90",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? "date-error" : undefined}
          >
            <CalendarIcon
              className={cn("mr-2 h-4 w-4", error ? "text-destructive" : "")}
            />
            {value ? format(value, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-3 p-3">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={month.toString()}
                onValueChange={(value) => setMonth(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthName, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={year.toString()}
                onValueChange={(value) => setYear(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              month={new Date(year, month)}
              onMonthChange={(newMonth) => {
                setMonth(newMonth.getMonth());
                setYear(newMonth.getFullYear());
              }}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
