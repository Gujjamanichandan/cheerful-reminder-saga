
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, isSameMonth, parseISO } from "date-fns";
import { Reminder, ReminderType } from "@/lib/supabase";

interface ReminderCalendarProps {
  reminders: Reminder[];
  onDateSelect?: (date: Date) => void;
}

export function ReminderCalendar({ reminders, onDateSelect }: ReminderCalendarProps) {
  const [date, setDate] = React.useState<Date>(new Date());

  // Map for storing dates with reminders
  const reminderDates = new Map<string, Reminder[]>();
  
  // Group reminders by date
  reminders.forEach((reminder) => {
    const dateString = format(parseISO(reminder.date), 'yyyy-MM-dd');
    if (!reminderDates.has(dateString)) {
      reminderDates.set(dateString, []);
    }
    reminderDates.get(dateString)?.push(reminder);
  });

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      if (onDateSelect) {
        onDateSelect(newDate);
      }
    }
  };

  // Custom day renderer function
  const dayRenderer = (day: Date, selectedDays: Date[], props: Record<string, any>) => {
    // Ignore date elements that are headers or outside the month
    if (props.outside || !props.date) {
      return props.children;
    }

    // Define a type for the day props to fix the spread type error
    type DayProps = {
      date: Date;
      className?: string;
      [key: string]: any;
    };
    
    const dayProps = props as DayProps;
    const { date, className, ...rest } = dayProps;
    
    if (!date) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasReminders = reminderDates.has(dateStr);
    
    // We'll show dots for each type (birthday, anniversary)
    const birthdayReminders = reminderDates.get(dateStr)?.filter(r => r.type === 'birthday') || [];
    const anniversaryReminders = reminderDates.get(dateStr)?.filter(r => r.type === 'anniversary') || [];
    
    return (
      <div 
        className={cn(
          className,
          "relative flex items-center justify-center p-0",
          hasReminders && 'font-semibold'
        )}
        {...rest}
      >
        {props.children}
        
        {/* Indicator dots */}
        {(birthdayReminders.length > 0 || anniversaryReminders.length > 0) && (
          <div className="absolute -bottom-1 flex gap-0.5 justify-center">
            {birthdayReminders.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            )}
            {anniversaryReminders.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">Your Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
          components={{
            Day: dayRenderer
          }}
        />
      </CardContent>
    </Card>
  );
}
