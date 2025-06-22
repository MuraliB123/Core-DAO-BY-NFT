const express = require("express");
const cors = require("cors");
const mintNFT = require("./controllers/mintHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mint", async (req, res) => {
  const metadataURI = req.body.metadataURI;

  if (!metadataURI) {
    return res.status(400).json({ error: "metadataURI is required" });
  }

  try {
    const result = await mintNFT(metadataURI);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("❌ Minting error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Minting API running at http://localhost:${PORT}`);
});
