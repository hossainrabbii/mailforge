"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DaySidePanel } from "@/components/DaySidePanel";
import { Website } from "@/types";

const MONTHS = [
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

interface IProps {
  website: Website[];
}
export function EmailCalendar({ website }: IProps) {
  const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const currentYear = new Date().getFullYear();
  const YEARS = [currentYear - 1, currentYear, currentYear + 1];

  function getEmailCountForDay(date: Date): number {
    const key = format(date, "yyyy-MM-dd");
    return website.filter((e) => {
      if (!e.sentAt) return false;
      return format(new Date(e.sentAt), "yyyy-MM-dd") === key;
    }).length;
  }

  function getEmailsForDay(date: Date) {
    const key = format(date, "yyyy-MM-dd");
    return website.filter((e) => {
      if (!e.sentAt) return false;
      return format(new Date(e.sentAt), "yyyy-MM-dd") === key;
    });
  }

  function getDots(count: number) {
    if (count === 0) return [];
    if (count === 1) return ["hsl(172 66% 50%)"];
    if (count === 2) return ["hsl(172 66% 50%)", "hsl(330 81% 60%)"];
    if (count === 3)
      return ["hsl(172 66% 50%)", "hsl(330 81% 60%)", "hsl(262 83% 58%)"];
    return [
      "hsl(172 66% 50%)",
      "hsl(330 81% 60%)",
      "hsl(262 83% 58%)",
      "hsl(38 92% 50%)",
    ];
  }
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const handleMonthChange = (value: string) => {
    const monthIndex = MONTHS.indexOf(value);
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (value: string) => {
    setCurrentDate(new Date(parseInt(value), currentDate.getMonth(), 1));
  };

  const selectedDayEmails = selectedDay ? getEmailsForDay(selectedDay) : [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Daily Activity
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily email sending activity
        </p>
      </div>
      <div className="flex items-start gap-6 flex-col lg:flex-row">
        {/* Calendar Card */}
        <div className="w-full max-w-[520px] rounded-2xl border bg-card p-6 shadow-sm">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                value={MONTHS[currentDate.getMonth()]}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-9 w-[130px] border-none bg-muted text-sm font-medium shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(currentDate.getFullYear())}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-9 w-[90px] border-none bg-muted text-sm font-medium shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAY_HEADERS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const inMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isToday = isSameDay(day, today);
              const count = getEmailCountForDay(day);
              const dots = getDots(count);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    group relative flex h-14 flex-col items-center justify-center rounded-lg
                    transition-colors duration-150
                    ${inMonth ? "text-foreground" : "text-muted-foreground/40"}
                    ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                    ${isToday && !isSelected ? "ring-2 ring-primary" : ""}
                  `}
                >
                  <span className="text-sm font-medium">
                    {format(day, "d")}
                  </span>
                  {dots.length > 0 && (
                    <div className="mt-0.5 flex gap-[3px]">
                      {dots.map((color, i) => (
                        <span
                          key={i}
                          className={`block h-[5px] w-[5px] rounded-full ${isSelected ? "opacity-80" : ""}`}
                          style={{
                            backgroundColor: isSelected
                              ? "hsl(var(--primary-foreground))"
                              : color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-1.5">
              <span
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: "hsl(172 66% 50%)" }}
              />
              <span className="text-xs text-muted-foreground">1 email</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: "hsl(330 81% 60%)" }}
              />
              <span className="text-xs text-muted-foreground">2 emails</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: "hsl(262 83% 58%)" }}
              />
              <span className="text-xs text-muted-foreground">3 emails</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: "hsl(38 92% 50%)" }}
              />
              <span className="text-xs text-muted-foreground">4+ emails</span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {selectedDay && (
          <DaySidePanel
            date={selectedDay}
            emails={selectedDayEmails}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </div>
    </>
  );
}
