import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Vote, CheckCircle, ShoppingCart, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VotingState = "initial" | "voting" | "buying" | "completed";
type BuyingStep = "checking" | "buying" | "done";

const Index = () => {
  const [votingState, setVotingState] = useState<VotingState>("initial");
  const [buyingStep, setBuyingStep] = useState<BuyingStep>("checking");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const { toast } = useToast();

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const votingOptions = [
    "Outstanding content creation",
    "Innovative video concepts",
    "Community engagement excellence",
    "Technical video quality"
  ];

  const handleVoteClick = async () => {
    try {
      const response = await fetch("http://localhost:4000/getPollDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch question");
      const data = await response.json();
      setQuestion(data.question);
      setOptions(data.options);
      setVotingState("voting");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load voting question.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNFT = async () => {
    if (!selectedOption) {
      toast({
        title: "Please select an option",
        description: "You must choose an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setVotingState("buying");
    setBuyingStep("checking");

    // Replace these with actual values as needed
  const contractAddress = "0xE4A80b8529Be90ca8D889fb66fAc033322733bd7";
  const recipientAddress = "0x2B30481ce79008ac7734b0Ff81aCc4858c0465D3";// Example recipient address

    try {
      // Step 1: Checking NFT collection (simulate delay)
      setTimeout(async () => {
        setBuyingStep("buying");

        // Step 2: Call backend to transfer NFT
        try {
          const response = await fetch("http://localhost:4000/transferNFT", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contractAddress, recipientAddress }),
          });
          const result = await response.json();

          setBuyingStep("done");

          // Step 3: Complete the process
          setTimeout(() => {
            setVotingState("completed");
            if (result.success) {
              toast({
                title: "NFT Purchase Complete!",
                description: "Your vote has been recorded and NFT acquired.",
              });
            } else {
              toast({
                title: "NFT Transfer Failed",
                description: result.error || "Unknown error occurred.",
                variant: "destructive",
              });
            }
          }, 1500);
        } catch (error) {
          setBuyingStep("done");
          setTimeout(() => {
            setVotingState("completed");
            toast({
              title: "NFT Transfer Error",
              description: "Could not transfer NFT. Please try again.",
              variant: "destructive",
            });
          }, 1500);
        }
      }, 1500);
    } catch (error) {
      setVotingState("completed");
      toast({
        title: "NFT Transfer Error",
        description: "Could not transfer NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const index = (options.length > 0 ? options : votingOptions).findIndex(opt => opt === selectedOption);

    try {
      const response = await fetch("http://localhost:4000/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: index }), // <-- FIXED HERE
      });
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Vote Submitted!",
          description: "Thank you for voting for this creator.",
        });
      } else {
        toast({
          title: "Vote Submission Failed",
          description: result.error || "Unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Vote Submission Error",
        description: "Could not submit your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getBuyingStepText = () => {
    switch (buyingStep) {
      case "checking":
        return "Checking NFT collection...";
      case "buying":
        return "Initiating Buy...";
      case "done":
        return "Done!";
      default:
        return "";
    }
  };

  const getBuyingStepNumber = () => {
    switch (buyingStep) {
      case "checking":
        return "1";
      case "buying":
        return "2";
      case "done":
        return "3";
      default:
        return "1";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Vote My Creators
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Creator Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">creator@tube.com</h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentDate}</p>
                </div>
                <Vote className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {votingState === "initial" && (
                <Button 
                  onClick={handleVoteClick} 
                  variant="vote" 
                  size="lg" 
                  className="w-full"
                >
                  Vote Here
                </Button>
              )}
              
              {votingState === "completed" && (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-4">Vote Complete!</p>
                  <Button onClick={handleSubmit} variant="gradient" size="lg" className="w-full">
                    Submit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voting Form */}
          {votingState === "voting" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  {question || "What do you think makes this creator outstanding?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {(options.length > 0 ? options : votingOptions).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-secondary/20 transition-colors">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-foreground cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleBuyNFT} 
                    variant="gradient" 
                    size="lg"
                    className="px-8"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NFT Buying Process */}
          {votingState === "buying" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {getBuyingStepNumber()}
                      </div>
                    </div>
                    {buyingStep !== "done" && (
                      <div className="absolute inset-0 w-20 h-20 mx-auto">
                        <div className="animate-spin rounded-full h-20 w-20 border-2 border-primary/20 border-t-primary"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {getBuyingStepText()}
                    </h3>
                    
                    <div className="flex justify-center space-x-2 mt-4">
                      {["checking", "buying", "done"].map((step, index) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            step === buyingStep
                              ? "bg-primary scale-125"
                              : ["checking", "buying", "done"].indexOf(buyingStep) > index
                              ? "bg-primary/60"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
};

export default Index;