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


### Transfer Alpha and Beta via Console

1. Open the Hardhat console for interacting with the blockchain:
npx hardhat console --network localhost

Paco wallet setting
const NewToken = await hre.ethers.getContractFactory("NewToken");
const Alpha = NewToken.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3')
await Alpha.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)


const Beta = NewToken.attach('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')
await Beta.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)

const Poly = NewToken.attach('0x0B306BF915C4d645ff596e518fAf3F9669b97016')
await Poly.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)

const ust = NewToken.attach('0x4A679253410272dd5232B3Ff7cF5dbB88f295319')
await ust.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)


const X = NewToken.attach('0x7a2088a1bFc9d81c55368AE168C2C02570cB814F')
await X.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)


Run the scripts at the workspace directory:
npx hardhat run scripts/transferPoly.js --network localhost
npx hardhat run scripts/transferUST.js --network localhost
npx hardhat run scripts/transferPoly.js --network localhost