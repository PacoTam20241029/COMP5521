# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# Running Docker
```shell
docker run --name=defi-swap -p 3000:3000 -p 8545:8545 -it comp5521-defi
docker exec -it defi-swap bash
```

# Running Frontend in Docker
```shell
cd frontend
npm start run
```
# Running test script in Docker
```shell
npx hardhat test
```
