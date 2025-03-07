
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/Navbar";

const Settings = () => {
  const { user } = useAuth();
  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        
        <Card className="max-w-2xl">
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
      </div>
    </>
  );
};

export default Settings;
