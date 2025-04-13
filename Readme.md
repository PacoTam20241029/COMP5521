## Setting Up guide

## Install Docker Desktop
1.Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2.Open a command shell or terminal
3.Check if Docker Desktop has been installed successfully: `docker version`
4.Download the latest Ubuntu image: docker pull ubuntu
5.Check your Docker images: docker images

### Build Docker Images

1. Create an empty folder: `mkdir MyDocker`
2. Go to the folder you have just created: `cd MyDocker` 
3. Create a file named “Dockerfile” (without filename extension): `touch Dockerfile`
4.Paste the following content into “Dockerfile” (e.g. via text editor):
FROM ubuntu:latest

WORKDIR /usr/app
COPY ./ /usr/app
RUN apt-get update \
&& apt-get -y install curl \
&& apt-get install -y build-essential \
&& apt-get install -y python3 \
&& curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \ 
&& export NVM_DIR="$HOME/.nvm" \
&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
&& [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" \
&& nvm install 22

5.Build a Docker image for your project: docker build -t comp5521-defi .
6.Check if the image was created successfully: docker images

## Run Docker Containers
1.docker run --name=defi-swap -p 3000:3000 -p 8545:8545 -it comp5521-defi
2.docker ps -a

## Hardhat (Setup Project Workspace)
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


## initiate a Hardhat: 
1.npx hardhat init
2.Select “Create an empty hardhat.config.js”
3.Paste the following content to “hardhat.config.js”:
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};

## Create a React project: 
cd ~/workspace
npx create-react-app frontend
cd frontend
npm install web3 ethers react-bootstrap bootstrap
npm install react-tabs
npm install @mui/lab @mui/material
npm i react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/material @mui/styled-engine-sc styled-components
npm install @mui/styles
npm install @mui/icons-material

# Run the React App
cd ~/workspace/frontend
npm start

## Payment Integration
## connect to Hardhat Network
1. At the workspace directory, run npx hardhat node. This starts a Hardhat network.
2. Select the network you are currently connected to in the upper left corner.
3. Select “Add a custom network”.
4. Enter `http://127.0.0.1:8545/` or `http://localhost:8545`  as the default RPC URL.
5. Enter `31337` as the chain ID.
6. Enter an arbitrary network name and an arbitrary currency symbol.
7. Click “Save”.

## Transfer Native Tokens via Script
cd ~/workspace
npx hardhat run scripts/transferDF.js --network localhost

## Deploy Contracts
cd workspace/contracts
touch LPToken.sol
touch NewToken.sol
touch Pool.sol
cd ..
npx hardhat compile

## Run the Deployment Script
npx hardhat run scripts/deploy.js --network localhost

## Run the Test Script
Run the following command at the workspace directory: npx hardhat test

### Transfer Alpha and Beta via Console

1. Open the Hardhat console for interacting with the blockchain:
npx hardhat console --network localhost

Paco wallet setting
const NewToken = await hre.ethers.getContractFactory("NewToken");
const Alpha = NewToken.attach('0x4A679253410272dd5232B3Ff7cF5dbB88f295319')
await Alpha.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)// change the wallet addresses


const Beta = NewToken.attach('0x7a2088a1bFc9d81c55368AE168C2C02570cB814F')
await Beta.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)// change the wallet addresses

const Poly = NewToken.attach('0x09635F643e140090A9A8Dcd712eD6285858ceBef')
await Poly.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)// change the wallet addresses

const ust = NewToken.attach('0xc5a5C42992dECbae36851359345FE25997F5C42d')
await ust.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n)// change the wallet addresses

const X = NewToken.attach('0x67d269191c92Caf3cD7723F116c85e6E9bf55933')
await X.transfer('0xAD92104E54daac94fC64F1FfDd5905fD471de08c', 100000000000000000000000n) // change the wallet addresses


Run the scripts at the workspace directory:
- `npx hardhat run scripts/transferALPHA.js --network localhost`
- `npx hardhat run scripts/transferBETA.js --network localhost`
- `npx hardhat run scripts/transferPoly.js --network localhost`
- `npx hardhat run scripts/transferUST.js --network localhost`
- `npx hardhat run scripts/transferPoly.js --network localhost`,



