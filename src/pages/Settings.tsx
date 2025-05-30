
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reminder } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTestingReminder, setIsTestingReminder] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("reminders")
          .select("*")
          .eq("user_id", user.id)
          .eq("archived", false);
        
        if (error) throw error;
        
        setReminders(data as Reminder[]);
        
        if (!data || data.length === 0) {
          await createTomorrowReminder();
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };
    
    fetchReminders();
  }, [user]);

  const createTomorrowReminder = async () => {
    if (!user) return;
    
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const reminderData = {
        user_id: user.id,
        person_name: "Demo Person",
        type: "birthday" as const,
        date: tomorrow.toISOString().split('T')[0],
        relationship: "friend",
        custom_message: "This is a test birthday reminder created for testing purposes.",
        notification_timing: [1, 0],
        notification_method: "email",
      };
      
      const { data, error } = await supabase
        .from("reminders")
        .insert(reminderData)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setReminders(prev => [...prev, data[0] as Reminder]);
        setSelectedReminderId(data[0].id);
        
        toast({
          title: "Demo Reminder Created",
          description: "A birthday reminder for 'Demo Person' has been created for tomorrow.",
        });
      }
    } catch (error) {
      console.error("Error creating demo reminder:", error);
      toast({
        title: "Error",
        description: "Failed to create demo reminder.",
        variant: "destructive",
      });
    }
  };

  const testSpecificReminder = async () => {
    if (!selectedReminderId) {
      toast({
        title: "No Reminder Selected",
        description: "Please select a reminder to test.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTestingReminder(true);
      toast({
        title: "Testing Reminder",
        description: "Processing your selected reminder...",
      });
      
      const { data, error } = await supabase.functions.invoke("check-reminders", {
        method: "POST",
        body: {
          reminderId: selectedReminderId,
        },
      });

      if (error) {
        console.error("Error response from function:", error);
        throw error;
      }

      console.log("Reminder check result:", data);
      const emailsSent = data?.emailsSent || [];
      
      if (emailsSent.length > 0) {
        toast({
          title: "Reminder Email Sent",
          description: `A reminder email for ${emailsSent[0].personName} has been sent to your email address. Please check your inbox (and spam folder).`,
        });
      } else {
        toast({
          title: "No Email Sent",
          description: "The reminder check ran successfully but no emails were sent. Check the console for details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error testing reminder:", error);
      toast({
        title: "Failed to Test Reminder",
        description: `Error: ${error.message || "Unknown error"}. Please check the console logs for details.`,
        variant: "destructive",
      });
    } finally {
      setIsTestingReminder(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        
        <Card className="max-w-2xl mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Test Specific Reminder</CardTitle>
            <CardDescription>
              Test the reminder system with one of your upcoming reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select a reminder from the dropdown and click the button to simulate the reminder notification.
              This will send an email for the selected reminder to your email address.
            </p>
            
            {reminders.length > 0 ? (
              <div>
                <Select 
                  onValueChange={(value) => setSelectedReminderId(value)}
                  value={selectedReminderId || undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a reminder to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {reminders.map((reminder) => (
                      <SelectItem key={reminder.id} value={reminder.id}>
                        {reminder.person_name}'s {reminder.type} ({reminder.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-sm italic">No reminders found. Set up a reminder first.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            {reminders.length === 0 && (
              <Button 
                onClick={createTomorrowReminder}
                variant="outline"
              >
                Create Demo Birthday (Tomorrow)
              </Button>
            )}
            <Button 
              onClick={testSpecificReminder} 
              disabled={isTestingReminder || !selectedReminderId}
              className="bg-celebration hover:bg-celebration/90"
            >
              {isTestingReminder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : "Test Selected Reminder"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Settings;
