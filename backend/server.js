const express = require("express");
const cors = require("cors");
const mintNFT = require("./controllers/mintHandler");
const deployPoll = require("./controllers/deployPollHandler");
const getLeadingOption = require("./controllers/getLeadingOptionHandler"); 
const getPollDetails = require("./controllers/getPollDetailsHandler");
const transferFirstNFT = require("./controllers/transferFirstNFT");
const voteOnPoll = require("./controllers/voteHandler");
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Existing Mint endpoint
app.post("/mint", async (req, res) => {
  const metadataURI = req.body.metadataURI;
  const count = req.body.count || 1;

  if (!metadataURI) {
    return res.status(400).json({ error: "metadataURI is required" });
  }

  try {
    // Mint as many NFTs as the count value
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = await mintNFT(metadataURI);
      console.log(`Minted NFT #${i + 1}:`);
      results.push(result);
    }
    res.json({ success: true, minted: results });
  } catch (error) {
    console.error("❌ Minting error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🆕 New Poll Deployment endpoint
app.post("/deployPoll", async (req, res) => {
  const { question, options } = req.body;
  console.log("Received deployPoll request:", { question, options });
  if (!question || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ error: "question and options are required" });
  }

  try {
    const result = await deployPoll(question, options);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("❌ Poll deployment error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/leadingOption", async (req, res) => {
    let contractAddress = null
    try 
    {
      const cachePath = "\\backend\\cache.json"; 
      if (fs.existsSync(cachePath)) 
      {
        const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        contractAddress = cache.poll_contract;
      }
    } 
    catch (err)
    {
      return res.status(500).json({ success: false, error: "Failed to read contract address from cache." });
    }
 

  try {
    const result = await getLeadingOption(contractAddress);
    res.json({
      success: true,
      ...result,
    });
  }
  catch (error) {
    console.error("❌ Fetch leading option error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}); 

app.post("/getPollDetails", async (req, res) => {
  const cachePath = "\\backend\\cache.json";
  try {
    const result = await getPollDetails(cachePath);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("❌ Fetch poll details error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
});

app.post("/transferNFT", async (req, res) => {
  const contractAddress = req.body.contractAddress;
  const recipientAddress = req.body.recipientAddress;

  if (!contractAddress || !recipientAddress) {
    return res.status(400).json({ success: false, error: "contractAddress and recipientAddress are required" });
  }

  try {
    const result = await transferFirstNFT(contractAddress, recipientAddress); 
    console.log(`NFT ID transferred from ${contractAddress} to ${ recipientAddress}`);
    res.json(result);
  } catch (error) {
    console.error("❌ NFT transfer error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}); 

app.post("/vote", async (req, res) => {
  const { optionIndex } = req.body;
  console.log("Received vote request:", { optionIndex });
  if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex > 3) {
    return res.status(400).json({ success: false, error: "Valid optionIndex (0-3) is required" });
  }

  try {
    const result = await voteOnPoll(optionIndex);
    res.json(result);
  } catch (error) {
    console.error("❌ Voting error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}); 

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
