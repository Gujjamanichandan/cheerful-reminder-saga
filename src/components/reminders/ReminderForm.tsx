
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CheckboxItem, CheckboxItems } from "./CheckboxItems";
import { useNavigate } from "react-router-dom";
import { ReminderType } from "@/lib/supabase";

const relationships = [
  { value: "family", label: "Family Member" },
  { value: "friend", label: "Friend" },
  { value: "partner", label: "Partner/Spouse" },
  { value: "colleague", label: "Colleague" },
  { value: "other", label: "Other" },
];

const notificationMethods = [
  { value: "email", label: "Email" },
  { value: "push", label: "Push Notification" },
  { value: "both", label: "Both" },
];

// Default notification timings
const defaultTimings = {
  birthday: [1, 0], // 1 day before, day of
  anniversary: [5, 3, 1, 0], // 5, 3, 1 days before, day of
};

const formSchema = z.object({
  personName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.enum(["birthday", "anniversary"], {
    required_error: "Please select a reminder type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  relationship: z.string({
    required_error: "Please select a relationship",
  }),
  customMessage: z.string().optional(),
  notificationMethod: z.enum(["email", "push", "both"], {
    required_error: "Please select a notification method",
  }),
  notificationTiming: z.array(z.number()),
});

interface ReminderFormProps {
  onSuccess?: () => void;
  editingReminder?: any; // Add proper typing if you have reminder type
}

export function ReminderForm({ onSuccess, editingReminder }: ReminderFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Properly initialize the date when editing a reminder
  const initialDate = editingReminder 
    ? new Date(editingReminder.date + "T00:00:00") // Ensure midnight in local timezone
    : new Date();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingReminder ? {
      personName: editingReminder.person_name,
      type: editingReminder.type as ReminderType,
      date: initialDate,
      relationship: editingReminder.relationship,
      customMessage: editingReminder.custom_message || "",
      notificationMethod: editingReminder.notification_method,
      notificationTiming: editingReminder.notification_timing,
    } : {
      personName: "",
      type: "birthday",
      date: initialDate,
      relationship: "family",
      customMessage: "",
      notificationMethod: "email",
      notificationTiming: defaultTimings.birthday,
    },
  });

  // Watch for type changes to update notification timing defaults
  const reminderType = form.watch("type");
  
  // Reset notification timing when type changes
  const handleTypeChange = (value: "birthday" | "anniversary") => {
    form.setValue("type", value);
    if (!editingReminder) {
      form.setValue("notificationTiming", defaultTimings[value]);
    }
  };

  const getTimingOptions = (type: "birthday" | "anniversary") => {
    if (type === "birthday") {
      return [
        { value: 7, label: "1 week before" },
        { value: 3, label: "3 days before" },
        { value: 1, label: "1 day before" },
        { value: 0, label: "On the day" },
      ];
    } else {
      return [
        { value: 14, label: "2 weeks before" },
        { value: 7, label: "1 week before" },
        { value: 5, label: "5 days before" },
        { value: 3, label: "3 days before" },
        { value: 1, label: "1 day before" },
        { value: 0, label: "On the day" },
      ];
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    try {
      setIsLoading(true);

      // Create a proper date string in YYYY-MM-DD format
      // Fix timezone issues by ensuring we get the correct local date
      const selectedDate = values.date;
      
      // Format date to preserve the exact day the user selected
      // Use a formatting method that doesn't shift days due to timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const reminderData = {
        user_id: user.id,
        person_name: values.personName,
        type: values.type,
        date: formattedDate,
        relationship: values.relationship,
        custom_message: values.customMessage || "",
        notification_timing: values.notificationTiming,
        notification_method: values.notificationMethod,
      };

      let result;
      
      if (editingReminder) {
        result = await supabase
          .from("reminders")
          .update(reminderData)
          .eq("id", editingReminder.id);
      } else {
        result = await supabase
          .from("reminders")
          .insert(reminderData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: editingReminder ? "Reminder Updated" : "Reminder Created",
        description: `${values.type === "birthday" ? "Birthday" : "Anniversary"} reminder for ${values.personName} ${editingReminder ? "updated" : "created"} successfully.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error saving reminder:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {editingReminder ? "Edit Reminder" : "Create New Reminder"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <select
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        {...field}
                      >
                        {relationships.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Reminder Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => handleTypeChange(value as "birthday" | "anniversary")}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem 
                            value="birthday" 
                            checked={field.value === "birthday"}
                            className={field.value === "birthday" ? "text-birthday border-birthday" : ""}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Birthday</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem 
                            value="anniversary" 
                            checked={field.value === "anniversary"}
                            className={field.value === "anniversary" ? "text-anniversary border-anniversary" : ""}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Anniversary</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date of the {reminderType}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        reminderType === "birthday"
                          ? "Happy birthday! Wishing you all the best on your special day!"
                          : "Happy anniversary! Celebrating your love and commitment!"
                      }
                      className="resize-none min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Personalize your message for this {reminderType}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Notification Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {notificationMethods.map((method) => (
                        <FormItem key={method.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={method.value} checked={field.value === method.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{method.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationTiming"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When to Send Notifications</FormLabel>
                  <FormControl>
                    <CheckboxItems
                      items={getTimingOptions(reminderType)}
                      values={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select when you want to receive reminders
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={cn(
                "w-full",
                reminderType === "birthday" 
                  ? "bg-birthday hover:bg-birthday/90" 
                  : "bg-anniversary hover:bg-anniversary/90"
              )}
              disabled={isLoading}
            >
              {isLoading 
                ? (editingReminder ? "Updating..." : "Creating...") 
                : (editingReminder ? "Update Reminder" : "Create Reminder")
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
