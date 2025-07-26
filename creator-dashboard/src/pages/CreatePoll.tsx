import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Vote, Plus, Trash2 } from "lucide-react";

const CreatePoll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [latestResult, setLatestResult] = useState<string | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a poll question",
        variant: "destructive"
      });
      return;
    }

    const filledOptions = options.filter(option => option.trim() !== "");
    if (filledOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 options for the poll",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/deployPoll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question,
          options: filledOptions
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create poll");
      }

      toast({
        title: "Poll Created Successfully!",
        description: "Your poll has been created and is now live."
      });

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGetLatestResults = async () => {
    try {
      const response = await fetch("http://localhost:4000/leadingOption", {
        method: "POST", // <-- changed from GET to POST
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch latest results");
      }
      const data = await response.json();
      setLatestResult(data.leadingOption || "No result available");
    } catch (error) {
      setLatestResult("Failed to fetch latest results.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:shadow-glow transition-smooth"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Create Poll
        </h1>
            <p className="text-muted-foreground">
              Design an engaging poll for your community
            </p>
          </div>
        </div>

        {/* Poll Creation Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-elegant">
            <CardHeader className="text-center">
            
              <CardTitle className="text-2xl">Poll Configuration</CardTitle>
              <CardDescription>
                Create a question with up to 4 multiple choice options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-lg font-semibold">
                  Poll Question
                </Label>
                <Textarea
                  id="question"
                  placeholder="What would you like to ask your community?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] transition-smooth focus:shadow-glow resize-none"
                />
              </div>

              {/* Options Input */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Answer Options</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">

                      <Input
                        placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 transition-smooth focus:shadow-glow"
                        required={index < 2}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  At least 2 options are required. You can leave options 3 and 4 empty if not needed.
                </p>
              </div>

              {/* Preview Section */}
              {question && (
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-foreground">Poll Preview</h3>
                  <div className="space-y-3">
                    <p className="text-sm font-medium">{question}</p>
                    <div className="space-y-2">
                      {options.filter(option => option.trim()).map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-border rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1 transition-smooth hover:shadow-glow"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePoll}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth shadow-card"
                >  
                  Create Poll
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGetLatestResults}
                  className="flex-1 transition-smooth hover:shadow-glow"
                >
                  Get Latest Results
                </Button>
              </div>

              {/* Popup for latest result */}
              {latestResult && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                  <div className="bg-card p-6 rounded-lg shadow-lg min-w-[300px] text-center relative">
                    <h2 className="text-lg font-bold mb-2">Latest Leading Option</h2>
                    <p className="mb-4">{latestResult}</p>
                    <Button
                      variant="outline"
                      onClick={() => setLatestResult(null)}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;