// mintHandler.js
const { ethers } = require("hardhat");

async function mintNFT(metadataURI) {
  const contractAddress = "0xE4A80b8529Be90ca8D889fb66fAc033322733bd7";

  const [owner] = await ethers.getSigners();

  const nft = await ethers.getContractAt("InfNFT", contractAddress, owner);
  const tx = await nft.safeMint(owner.address, metadataURI);
  const receipt = await tx.wait();

  return {
    to: owner.address,
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
  };
}

module.exports = mintNFT;
