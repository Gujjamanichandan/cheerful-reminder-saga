
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, Gift, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 bg-gradient-to-b from-white to-celebration-subtle dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex bg-celebration/10 text-celebration rounded-full px-4 py-1.5 text-sm font-medium mb-2">
                Never forget a special occasion again
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Celebrate Every <span className="text-celebration">Special Moment</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Keep track of birthdays and anniversaries with personalized reminders and thoughtful suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-celebration hover:bg-celebration/90"
                  onClick={() => navigate("/sign-up")}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-celebration/20 rounded-full blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-celebrate transform hover:scale-105 transition-transform">
                    <Gift className="h-10 w-10 text-birthday mb-2" />
                    <h3 className="font-semibold">Emma's Birthday</h3>
                    <p className="text-sm text-muted-foreground">In 5 days</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <Heart className="h-10 w-10 text-anniversary mb-2" />
                    <h3 className="font-semibold">Wedding Anniversary</h3>
                    <p className="text-sm text-muted-foreground">Next month</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-10">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <CalendarDays className="h-10 w-10 text-celebration mb-2" />
                    <h3 className="font-semibold">Regular Reminders</h3>
                    <p className="text-sm text-muted-foreground">Never miss a date</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg animate-celebrate transform hover:scale-105 transition-transform">
                    <Gift className="h-10 w-10 text-birthday mb-2" />
                    <h3 className="font-semibold">Michael's Birthday</h3>
                    <p className="text-sm text-muted-foreground">Tomorrow!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Remember Special Occasions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our app makes sure you never forget an important date with smart reminders and helpful features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-birthday-subtle mb-4 flex items-center justify-center">
                <Gift className="h-6 w-6 text-birthday" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Birthday Reminders</h3>
              <p className="text-muted-foreground">
                Get timely reminders for birthdays with personalized messages and gift suggestions.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-birthday" />
                  Custom notification timing
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-birthday" />
                  Personalized messages
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-birthday" />
                  Gift ideas and suggestions
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-anniversary-subtle mb-4 flex items-center justify-center">
                <Heart className="h-6 w-6 text-anniversary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anniversary Tracking</h3>
              <p className="text-muted-foreground">
                Never miss an anniversary with early reminders, love quotes, and milestone celebrations.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-anniversary" />
                  Early notifications
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-anniversary" />
                  Anniversary gift ideas
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-anniversary" />
                  Special milestone celebrations
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-celebration-subtle mb-4 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-celebration" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Calendar</h3>
              <p className="text-muted-foreground">
                View all your important dates in one place with our integrated calendar view.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-celebration" />
                  Monthly and yearly views
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-celebration" />
                  Email and push notifications
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-celebration" />
                  Automated scheduling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Never Miss a Special Occasion?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who use our app to keep track of their important dates.
            </p>
            <Button 
              size="lg" 
              className="bg-celebration hover:bg-celebration/90"
              onClick={() => navigate("/sign-up")}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-50 dark:bg-gray-900 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Gift className="h-5 w-5 text-celebration" />
              <span className="text-sm font-semibold">Cheerful Reminder</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cheerful Reminder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
