const { ethers } = require("hardhat");

async function transferFirstNFT(contractAddress, recipientAddress) {
  const [sender] = await ethers.getSigners();
  const nft = await ethers.getContractAt("InfNFT", contractAddress, sender);

  const balance = await nft.balanceOf(sender.address);
  if (balance.eq(0)) {
    return { success: false, message: "Sender has no NFTs to transfer." };
  }

  // Get the first tokenId owned by sender (index 0)
  const tokenId = await nft.tokenOfOwnerByIndex(sender.address, 0);

  const tx = await nft["safeTransferFrom(address,address,uint256)"](
    sender.address,
    recipientAddress,
    tokenId
  );
  await tx.wait();

  return {
    success: true,
    tokenId: tokenId.toString(),
    from: sender.address,
    to: recipientAddress,
    message: `NFT ID ${tokenId} transferred from ${sender.address} to ${recipientAddress}`
  };
}

module.exports = transferFirstNFT;