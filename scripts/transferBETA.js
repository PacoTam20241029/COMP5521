const { ethers } = require("hardhat");
const addresses = require("/Users/pacotam/Desktop/workspace/frontend/src/utils/deployed-addresses.json"); 

async function main() {
  // Connect to the Hardhat network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Replace with the private key of the sender account
  const senderPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Default Hardhat account #1
  const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

  // Replace with the address of the recipient account
  const recipientAddress = '0xAD92104E54daac94fC64F1FfDd5905fD471de08c'; // Recipient address
  const amount = "500000"; // Amount of tokens to transfer
  
  const NewToken = await hre.ethers.getContractFactory("NewToken");
  const Beta = NewToken.attach(addresses.token1);
  
  // Convert amount to the token's smallest unit (wei)
  const amountInWei = ethers.parseEther(amount);
  
  // Transfer tokens
  console.log(`Transferring ${amount} ALPHA tokens to ${recipientAddress}...`);
  const tx = await Beta.transfer(recipientAddress, amountInWei);
  
  // Wait for the transaction to be mined
  await tx.wait();
  console.log(`Transaction successful with hash: ${tx.hash}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });