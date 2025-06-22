import { useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("");
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    try {
      setMinting(true);
      setStatus("Sending mint request to backend...");

      const metadataURI = "ipfs://bafkreiere5i5x7y2gxw6h67hml72ifwkxvdp42wc5452nha4eazoytol6q";
      const res = await axios.post("http://localhost:4000/mint", { metadataURI });

      if (res.data.success) {
        setStatus(`✅ Minted to ${res.data.to}, TX: ${res.data.txHash}`);
      } else {
        setStatus("❌ Mint failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error connecting to mint server.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mint NFT </h1>
      <button onClick={handleMint} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      <p>{status}</p>
    </div>
  );
}

export default App;
