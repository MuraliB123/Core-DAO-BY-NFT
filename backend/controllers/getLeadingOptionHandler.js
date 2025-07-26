// controllers/getLeadingOptionHandler.js
const { ethers } = require("hardhat");

async function getLeadingOption(contractAddress) {
  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  }

  const Poll = await ethers.getContractFactory("Poll");
  const poll = Poll.attach(contractAddress); // Attach to existing deployed contract

  const [option, voteCount] = await poll.getLeadingOption();

  return {
    leadingOption: option,
    votes: voteCount.toString(),
  };
}

module.exports = getLeadingOption;
