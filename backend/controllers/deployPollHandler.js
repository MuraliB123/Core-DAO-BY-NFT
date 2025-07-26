// controllers/deployPollHandler.js
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployPoll(question, options) {
  if (!question || !Array.isArray(options) || options.length === 0) {
    throw new Error("Invalid question or options");
  }

  const Poll = await ethers.getContractFactory("Poll");
  const poll = await Poll.deploy(question, options);
  await poll.deployed();

  const cachePath = "\\backend\\cache.json";


  let cache = {};
  if (fs.existsSync(cachePath)) {
    try {
        cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch (e) {
        cache = {};
    }
   }



  cache.poll_contract = poll.address;
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

  return {
    address: poll.address,
    question,
    options,
  };
}

module.exports = deployPoll;
