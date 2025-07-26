const fs = require('fs');
const { ethers } = require("hardhat");

async function getPollDetails(cachePath) {
  let contractAddress = null;
  if (fs.existsSync(cachePath)) {
    const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    contractAddress = cache.poll_contract;
  } else {
    throw new Error("Cache file not found");
  }

  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  }

  const Poll = await ethers.getContractFactory("Poll");
  const poll = Poll.attach(contractAddress);

  const question = await poll.question();
  const options = [];
  for (let i = 0; i < 4; i++) {
    options.push(await poll.options(i));
  }

  return { question, options };
}

module.exports = getPollDetails;