
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const EditReminder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [reminder, setReminder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchReminder();
    }
  }, [user, id]);

  const fetchReminder = async () => {
    if (!user || !id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        toast({
          title: "Reminder Not Found",
          description: "The reminder you're trying to edit doesn't exist or you don't have permission to edit it.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
      
      setReminder(data);
    } catch (error: any) {
      console.error("Error fetching reminder:", error);
      toast({
        title: "Error",
        description: "Failed to load reminder details. Please try again.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Reminder</h1>
          <p className="text-muted-foreground">
            Update the details for this reminder
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse">Loading reminder details...</div>
          </div>
        ) : reminder ? (
          <ReminderForm 
            editingReminder={reminder} 
            onSuccess={() => navigate("/dashboard")} 
          />
        ) : null}
      </div>
    </div>
  );
};

export default EditReminder;
