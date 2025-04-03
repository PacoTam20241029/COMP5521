Create the file:
cd Desktop
mkdir workspace
cd workspace
mkdir contracts scripts test

install step:

npm init -y 
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-ignition-ethers@^0.15.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-verify@^2.0.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "chai@^4.2.0" "ethers@^6.4.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "ts-node@>=8.0.0" "typechain@^8.3.0" "typescript@>=4.5.0"
npm install --save-dev "@nomicfoundation/hardhat-ignition@^0.15.10" "@nomicfoundation/ignition-core@^0.15.10"

npm install @openzeppelin/contracts

initiate a Hardhat project: npx hardhat init

-- Create a React project: 
npx create-react-app defi
cd defi
npm install web3 ethers react-bootstrap bootstrap

connect to Hardhat Network
npx hardhat node

