const { ethers } = require("hardhat");
const addresses = require("/Users/pacotam/Desktop/workspace/frontend/src/utils/deployed-addresses.json"); 

async function main() {
  // Connect to the Hardhat network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Replace with the address of the recipient account
  const recipientAddress = '0xAD92104E54daac94fC64F1FfDd5905fD471de08c'; // My address (from MetaMask)

  const NewToken = await hre.ethers.getContractFactory("NewToken");
  const x = NewToken.attach(addresses.token4);

  const amount = ethers.parseEther("500000");
  await x.transfer(recipientAddress, amount)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });