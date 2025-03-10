
import { Navbar } from "@/components/layout/Navbar";
import QuoteGenerator from "@/components/quotes/QuoteGenerator";
import { useLocation } from "react-router-dom";

const QuoteGeneratorPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTopic = searchParams.get("type") as "birthday" | "anniversary" || "birthday";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          {defaultTopic === "birthday" ? "Birthday" : "Anniversary"} Quote Generator
        </h1>
        <QuoteGenerator defaultTopic={defaultTopic} />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select the type of occasion (Birthday or Anniversary)</li>
            <li>Optionally specify your relationship to the person</li>
            <li>Choose the tone and length for your message</li>
            <li>Click "Generate Quote" to create a personalized message</li>
            <li>Copy the generated text to use in your card, email, or message</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            You can also access the Quote Generator as a chat box from any page by clicking the message icon in the bottom right corner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneratorPage;
