
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Reminder } from "@/lib/supabase";

interface ReminderCalendarProps {
  reminders: Reminder[];
}

// Define the DayProps interface to fix the spread type error
interface DayProps {
  date: Date;
  displayMonth?: Date;
  selected?: boolean;
  disabled?: boolean;
  inRange?: boolean;
  firstInRange?: boolean;
  lastInRange?: boolean;
  today?: boolean;
  weekend?: boolean;
  outside?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any; // Allow additional properties
}

export function ReminderCalendar({ reminders }: ReminderCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [remindersOnDate, setRemindersOnDate] = useState<Reminder[]>([]);

  // Find reminders on the selected date
  useEffect(() => {
    if (!selectedDate) {
      setRemindersOnDate([]);
      return;
    }

    const dateString = format(selectedDate, "yyyy-MM-dd");

    // Check for reminders on the selected date
    const remindersOnSelectedDate = reminders.filter(
      (reminder) => reminder.date === dateString
    );

    setRemindersOnDate(remindersOnSelectedDate);
  }, [selectedDate, reminders]);

  // Custom implementation for highlighting dates with reminders
  const reminderDates = reminders.map((reminder) => new Date(reminder.date));

  // Customize the day rendering to highlight days with reminders
  const customDayRender = (props: DayProps) => {
    // Check if this day has any reminders
    const dateString = format(props.date, "yyyy-MM-dd");
    const hasReminders = reminders.some((reminder) => reminder.date === dateString);

    // Render with custom styling if it has reminders
    return (
      <div
        className={cn(
          "relative",
          props.outside && "text-muted-foreground opacity-50"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            hasReminders &&
              !props.selected &&
              "bg-red-200 dark:bg-red-900 rounded-md opacity-50"
          )}
        ></div>
        <div className="relative z-10">
          <props.day {...props} />
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          components={{
            Day: (props) => customDayRender(props),
          }}
          classNames={{
            day_selected: "bg-primary text-primary-foreground",
          }}
        />

        {selectedDate && remindersOnDate.length > 0 && (
          <div className="p-3 border-t">
            <h3 className="mb-1 font-medium">
              {remindersOnDate.length} reminder
              {remindersOnDate.length !== 1 ? "s" : ""} on this date:
            </h3>
            <ul className="space-y-1">
              {remindersOnDate.map((reminder) => (
                <li key={reminder.id} className="text-sm">
                  <span
                    className={cn(
                      "inline-block w-2 h-2 rounded-full mr-2",
                      reminder.type === "birthday"
                        ? "bg-birthday"
                        : "bg-anniversary"
                    )}
                  ></span>
                  {reminder.person_name}'s{" "}
                  {reminder.type === "birthday" ? "Birthday" : "Anniversary"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
