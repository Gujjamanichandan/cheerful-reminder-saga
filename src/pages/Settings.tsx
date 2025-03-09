
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  const sendTestEmail = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email address available to send test",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke("send-reminder-email", {
        method: "POST",
        body: {
          email: user.email,
          personName: "Test Person",
          eventType: "birthday",
          eventDate: new Date().toISOString(),
          daysUntil: 0,
          customMessage: "This is a test email to verify the email notification system is working properly.",
        },
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: "A test email has been sent to your email address.",
      });
      
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Failed to Send Email",
        description: "There was an error sending the test email. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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
            <CardTitle>Email System Test</CardTitle>
            <CardDescription>
              Test if the email notification system is working properly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to send a test email to your registered email address ({user?.email}).
              This helps verify that the reminder notification system is functioning correctly.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={sendTestEmail} 
              disabled={isSending}
              className="bg-celebration hover:bg-celebration/90"
            >
              {isSending ? "Sending..." : "Send Test Email"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Settings;
