import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, User, Coins, Vote } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ipfsCid, setIpfsCid] = useState("");
  const [mintCount, setMintCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleMintNFT = async () => {
    if (!ipfsCid) {
      toast({
        title: "Error", 
        description: "Please enter a valid IPFS CID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          metadataURI:ipfsCid,
          count: mintCount
        })
      });

      if (response.ok) {
        toast({
          title: "NFT Minted Successfully!",
          description: `Successfully minted ${mintCount} NFT${mintCount > 1 ? 's' : ''} with IPFS CID: ${ipfsCid}`
        });
        setIpfsCid("");
        setMintCount(1);
      } else {
        throw new Error("Minting failed");
      }
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
             NFT & Avatar Creation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create avatars, mint NFTs, and participate in decentralized voting
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Avatar Creation Card */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <UserCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Create Avatar</CardTitle>
              <CardDescription>
                Create your unique avatar from an external URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click below to create your unique avatar
                </p>
                <a 
                  href="https://huggingface.co/spaces/murali1729S/da_vinci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-card">
                    <User className="w-4 h-4 mr-2" />
                    Create Avatar
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* NFT Minting Card */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Coins className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Mint NFT</CardTitle>
              <CardDescription>
                Upload your IPFS CID and mint your NFTs on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ipfs-cid">IPFS CID</Label>
                <Input
                  id="ipfs-cid"
                  placeholder="QmYourIPFSCIDHere..."
                  value={ipfsCid}
                  onChange={(e) => setIpfsCid(e.target.value)}
                  className="transition-smooth focus:shadow-glow"
                />
                <p className="text-xs text-muted-foreground">
                  Upload your file to IPFS and paste the CID here
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mint-count">Number of NFTs</Label>
                <Input
                  id="mint-count"
                  type="number"
                  min="1"
                  max="100"
                  value={mintCount}
                  onChange={(e) => setMintCount(parseInt(e.target.value) || 1)}
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <Button 
                onClick={handleMintNFT} 
                disabled={isLoading}
                className="w-full bg-gradient-accent hover:opacity-90 transition-smooth shadow-card"
              >
                <Coins className="w-4 h-4 mr-2" />
                {isLoading ? "Minting..." : `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''}`}
              </Button>
            </CardContent>
          </Card>

          {/* Poll Creation Card */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Coins className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Create Poll</CardTitle>
              <CardDescription>
                Create engaging polls with multiple choice options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Question + 4 Options
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Design polls that engage your community and gather valuable insights
                </p>
                <Button 
                  onClick={() => navigate("/createpoll")}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-card"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Create Poll
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-card/60 backdrop-blur-sm border border-border">
            <CardHeader>
              <CardTitle className="text-center text-2xl">How to Use IPFS for NFT Minting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Step 1: Upload to IPFS</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use services like Pinata, NFT.Storage, or Web3.Storage</li>
                    <li>• Upload your image/metadata file</li>
                    <li>• Copy the generated CID (Content Identifier)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Step 2: Mint Your NFT</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Paste your IPFS CID in the input field</li>
                    <li>• Choose how many NFTs to mint</li>
                    <li>• Click "Mint NFTs" to send to blockchain</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;