
import { Navbar } from "@/components/layout/Navbar";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { useNavigate } from "react-router-dom";

const CreateReminder = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Reminder</h1>
          <p className="text-muted-foreground">
            Set up a new event to never forget an important date
          </p>
        </div>
        
        <ReminderForm onSuccess={() => navigate("/dashboard")} />
      </div>
    </div>
  );
};

export default CreateReminder;
