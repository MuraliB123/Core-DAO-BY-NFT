const { ethers } = require("hardhat");
const fs = require("fs");

async function voteOnPoll(optionIndex) {
  const cachePath = "\\backend\\cache.json";
  if (!fs.existsSync(cachePath)) {
    throw new Error("Cache file not found");
  }
  const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  const contractAddress = cache.poll_contract;

  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  }

  const [voter] = await ethers.getSigners();
  const Poll = await ethers.getContractFactory("Poll");
  const poll = Poll.attach(contractAddress);

  const tx = await poll.connect(voter).vote(optionIndex);
  await tx.wait();

  return { success: true, message: `Vote cast for option ${optionIndex}` };
}

module.exports = voteOnPoll;