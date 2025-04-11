const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Pool Contract", function () {

  let Token0, Token1, Token2,Token3, Token4, Pool;
  let token0, token1, token2, token3, token4,pool;
  let owner, user;

  before(async function () {

    // Deploy two tokens
    NewToken = await hre.ethers.getContractFactory("NewToken");
    
    // Deploy Alpha
    token0 = await NewToken.deploy("Alpha", "ALPHA");
    await token0.waitForDeployment();

    // Deploy Beta
    token1 = await NewToken.deploy("Beta", "BETA");
    await token1.waitForDeployment();

    // Deploy Poly
    token2 = await NewToken.deploy("Poly", "POLY");
    await token2.waitForDeployment();

    // Deploy UST
    token3 = await NewToken.deploy("Ust", "UST");
    await token3.waitForDeployment();

    // Deploy X
    token4 = await NewToken.deploy("x", "X");
    await token4.waitForDeployment();
    

    // Deploy the Pool
    Pool = await hre.ethers.getContractFactory("Pool");
    pool = await Pool.deploy(
      await token0.getAddress(),
      await token1.getAddress(),
      await token2.getAddress(),
      await token3.getAddress(),
      await token4.getAddress(),
    );
    await pool.waitForDeployment();

    [deployer, user] = await ethers.getSigners();

    // Send tokens to user for testing
    await token0.transfer(user.address, ethers.parseEther("1000"));
    await token1.transfer(user.address, ethers.parseEther("1000"));
    await token2.transfer(user.address, ethers.parseEther("1000"));
    await token3.transfer(user.address, ethers.parseEther("1000"));
    await token4.transfer(user.address, ethers.parseEther("1000"));
  });

  beforeEach(async function () {
    // Reset approvals for each test
    await token0.connect(user).approve(pool.getAddress(), ethers.parseEther("1000000"));
    await token1.connect(user).approve(pool.getAddress(), ethers.parseEther("1000000"));
    await token2.connect(user).approve(pool.getAddress(), ethers.parseEther("1000000"));
    await token3.connect(user).approve(pool.getAddress(), ethers.parseEther("1000000"));
    await token4.connect(user).approve(pool.getAddress(), ethers.parseEther("1000000"));
  });

  let snapshotId;

  before(async function () {
    // Take a snapshot before running any tests
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async function () {
    // Revert to the snapshot after each describe block
    await ethers.provider.send("evm_revert", [snapshotId]);
    // Take a new snapshot for the next test
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  describe("addLiquidity", function () {

    it("should add initial liquidity and mint LP tokens", async function () {

      const amount0 = ethers.parseEther("100");
      const tx = await pool.connect(user).addLiquidity(amount0);
      
      // Check LP tokens minted
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(amount0);

      // Check reserves updated correctly
      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(amount0);
      expect(res1).to.equal(amount0 * 2n); // INITIAL_RATIO = 2

      // Check event emission
      await expect(tx)
        .to.emit(pool, "AddedLiquidity")
        .withArgs(amount0, token0.getAddress(), amount0, token1.getAddress(), amount0 * 2n);
    });

    it("should add liquidity proportionally when pool has reserves", async function () {
      // Initial liquidity
      const amount0 = ethers.parseEther("100");
      await pool.connect(user).addLiquidity(amount0);

      // Additional liquidity
      const addAmount0 = ethers.parseEther("50");
      const tx = await pool.connect(user).addLiquidity(addAmount0);

      // Expected LP tokens: (50 * 100) / 100 = 50
      const expectedLP = addAmount0;
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(amount0 + expectedLP);

      // Check reserves
      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(amount0+addAmount0);
      expect(res1).to.equal(ethers.parseEther("300")); // 200 + 100

      // Check event
      await expect(tx)
        .to.emit(pool, "AddedLiquidity")
        .withArgs(expectedLP, token0.getAddress(), addAmount0, token1.getAddress(), addAmount0*2n);
    });

    it("should revert when adding zero liquidity", async function () {
      await expect(pool.connect(user).addLiquidity(0))
        .to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("swap", function () {
    beforeEach(async function () {
      // Add initial liquidity: 100 Token0, 200 Token1
      await pool.connect(user).addLiquidity(ethers.parseEther("100"));
    });

    it("should swap Alpha for Beta correctly with 0.3% fee", async function () {
      const swapAmount = ethers.parseEther("100");
      const fee = (swapAmount * 3n) / 1000n; // 0.3% fee = 0.3 Token0
      const amountAfterFee = swapAmount - fee; // 99.7 Token0

      // Expected output: (reserve1 * amountAfterFee) / (reserve0 + amountAfterFee)
      const expectedOutput = (ethers.parseEther("200") * amountAfterFee) / (ethers.parseEther("100") + amountAfterFee); // (200 * 99.7) / (100 + 99.7) ~= 99.84

      // Perform swap
      const tx = await pool.connect(user).swap(token0.getAddress(), swapAmount, token1.getAddress());

      // Check user's balances
      const initialBal0 = ethers.parseEther("900");// 900 Token0 (after adding liquidity)
      const initialBal1 = ethers.parseEther("800"); // 800 Token1 (after adding liquidity)

      const finalBal0 = await token0.balanceOf(user.address);
      const finalBal1 = await token1.balanceOf(user.address);

      expect(finalBal0).to.equal(initialBal0 - swapAmount); // 900 - 100 = 800
      expect(finalBal1).to.equal(initialBal1 + expectedOutput); // 800 + 99 = 899

      // Check reserves
      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(ethers.parseEther("100") + swapAmount); // 100 + 100 = 200
      expect(res1).to.equal(ethers.parseEther("200") - expectedOutput); // 200 - 99.84 = 100.16 ~= 100

      // Check event
      await expect(tx)
        .to.emit(pool, "Swapped")
        .withArgs(token0.getAddress(), swapAmount, token1.getAddress(), expectedOutput);
    });
	  
    it("should revert for invalid token pairs", async function () {
      await expect(pool.connect(user).swap(token0.getAddress(), 100, token0.getAddress()))
        .to.be.revertedWith("Same tokens");
    });

    it("should revert for zero swap amount", async function () {
      await expect(pool.connect(user).swap(token0.getAddress(), 0, token1.getAddress()))
        .to.be.revertedWith("Zero amount");
    });
    
  });

  describe("getRequiredAmount1", function () {
    it("should return initial ratio when pool is empty", async function () {
      const amount0 = ethers.parseEther("100");
      const requiredAmount1 = await pool.getRequiredAmount1(amount0);
      expect(requiredAmount1).to.equal(amount0 * 2n);
    });

    it("should return proportional amount when pool has reserves", async function () {
      await pool.connect(user).addLiquidity(ethers.parseEther("100"));
      const amount0 = ethers.parseEther("50");
      const requiredAmount1 = await pool.getRequiredAmount1(amount0);
      expect(requiredAmount1).to.equal(ethers.parseEther("100")); // (50 * 200) / 100
    });
  });

  describe("getAmountOut", function () {
    beforeEach(async function () {
      await pool.connect(user).addLiquidity(ethers.parseEther("100"));
    });

    it("should calculate correct output for Token0 to Token1", async function () {
      const amountIn = ethers.parseEther("100");
      const fee = (amountIn * 3n) / 1000n; // 0.3% fee = 0.3 Token0
      const amountAfterFee = amountIn - fee; // 99.7 Token0
      const expectedOutput = (ethers.parseEther("200") * amountAfterFee) / (ethers.parseEther("100") + amountAfterFee); // (200 * 99.7) / (100 + 99.7)
      const amountOut = await pool.getAmountOut(token0.getAddress(), amountIn, token1.getAddress());
      expect(amountOut).to.equal(expectedOutput); // (200 * 99.7) / (100 + 99.7) ~= 99.85 ~= 99
    });

    it("should calculate correct output for Token1 to Token0", async function () {
      // First swap to change reserves to 200 Token0, 100 Token1 cause 0.3% exchange fee
      await pool.connect(user).swap(token0.getAddress(), ethers.parseEther("100"), token1.getAddress());

      const swapAmount = ethers.parseEther("100");
      const swap_fee = (swapAmount * 3n) / 1000n; // 0.3% fee = 0.3 Token0
      const amountAfterSwap = swapAmount - swap_fee; // 99.7 Token0
      //Expected output: (reserve1 * amountAfterFee) / (reserve0 + amountAfterFee)
      const expectedToken1Output = (ethers.parseEther("200") * amountAfterSwap) / (ethers.parseEther("100") + amountAfterSwap); // (200 * 99.7) / (100 + 99.7) ~= 99.84

      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(ethers.parseEther("100") + swapAmount); // 100 + 100 = 200
      expect(res1).to.equal(ethers.parseEther("200") - expectedToken1Output); // 200 - 99 = 101

      const amountIn = ethers.parseEther("50");
      const fee = (amountIn * 3n) / 1000n; // 0.3% fee = 0.15 Token1
      const amountAfterFee = amountIn - fee; // 49.85 Token1
      const expectedOutput = (ethers.parseEther("200") * amountAfterFee) / (ethers.parseEther("200") - expectedToken1Output + amountAfterFee); // (200 * 49.85) / (100.15 + 49.85) ~= 66.46 ~= 66
      
      const amountOut = await pool.getAmountOut(token1.getAddress(), amountIn, token0.getAddress());
      expect(amountOut).to.equal(expectedOutput);
    });
  });
  describe("withdrawLiquidity", function () {
    it("should withdraw liquidity and burn LP tokens", async function () {
      // Add initial liquidity
      const amount0 = ethers.parseEther("100");
      await pool.connect(user).addLiquidity(amount0);
  
      // Withdraw liquidity
      const amountLP = ethers.parseEther("50"); // Amount of LP tokens to withdraw
      const tx = await pool.connect(user).withdrawLiquidity(amountLP);
  
      // Check LP tokens burned
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(amount0 - amountLP);

      // Check user tokens remain
      const initialBal0 = ethers.parseEther("1000");
      const initialBal1 = ethers.parseEther("1000");

      const finalBal0 = await token0.balanceOf(user.address);
      const finalBal1 = await token1.balanceOf(user.address);

      expect(finalBal0).to.equal(initialBal0 - amount0 + amountLP); // 900
      expect(finalBal1).to.equal(initialBal1 - amount0 * 2n + amountLP * 2n); // 800
  
      // Check reserves updated correctly
      const [res0, res1] = await pool.getReserves();
      const expectedRes0 = (amountLP * ethers.parseEther("100")) / amount0; // Proportional amount of token0
      const expectedRes1 = (amountLP * ethers.parseEther("200")) / amount0; // Proportional amount of token1
      expect(res0).to.equal(ethers.parseEther("100") - expectedRes0);
      expect(res1).to.equal(ethers.parseEther("200") - expectedRes1);
  
      // Check event emission
      await expect(tx)
        .to.emit(pool, "RemovedLiquidity")
        .withArgs(amountLP, token0.getAddress(), expectedRes0, token1.getAddress(), expectedRes1);
    });
  
    it("should revert when withdrawing zero liquidity", async function () {
      await expect(pool.connect(user).withdrawLiquidity(0))
        .to.be.revertedWith("Amount must be greater than 0");
    });
  
    it("should revert when withdrawing more liquidity than owned", async function () {
      // Add initial liquidity
      const amount0 = ethers.parseEther("100");
      await pool.connect(user).addLiquidity(amount0);
  
      // Attempt to withdraw more LP tokens than owned
      const amountLP = ethers.parseEther("200"); // Exceeds user's LP balance
      await expect(pool.connect(user).withdrawLiquidity(amountLP))
        .to.be.revertedWith("Not enough LP tokens");
    });
  
    it("should withdraw all liquidity and reset reserves", async function () {
      // Add initial liquidity
      const amount0 = ethers.parseEther("100");
      await pool.connect(user).addLiquidity(amount0);
  
      // Withdraw all liquidity
      const amountLP = ethers.parseEther("100"); // Withdraw all LP tokens
      const tx = await pool.connect(user).withdrawLiquidity(amountLP);
  
      // Check LP tokens burned
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(0);
  
      // Check reserves reset to zero
      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(0);
      expect(res1).to.equal(0);
  
      // Check event emission
      await expect(tx)
        .to.emit(pool, "RemovedLiquidity")
        .withArgs(amountLP, token0.getAddress(), ethers.parseEther("100"), token1.getAddress(), ethers.parseEther("200"));
    });
  });
  describe("addLiquidityMulti", function () {
    it("should add initial liquidity and mint LP tokens", async function () {

      const amounts = [ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100")];
      const tx = await pool.connect(user).addLiquidityMulti(amounts);
      
      // Check LP tokens minted
      const lpBalance = await pool.balanceOf(user.address);
      expectedLP = ethers.parseEther("100");
      expect(lpBalance).to.equal(expectedLP);

      // Check reserves updated correctly
      const [res0, res1, res2, res3, res4] = await pool.getReservesMulti();
      expect(res0).to.equal(amounts[0]);
      expect(res3).to.equal(amounts[3]);

      // Check event emission
      const token_address_list = [await token0.getAddress(), await token1.getAddress(), await token2.getAddress(), await token3.getAddress(), await token4.getAddress()];
      await expect(tx)
        .to.emit(pool, "AddedLiquidityMulti")
        .withArgs(token_address_list, amounts, expectedLP);
    });

    it("should add liquidity proportionally when pool has reserves", async function () {
      // Initial liquidity
      const amounts = [ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100")];
      await pool.connect(user).addLiquidityMulti(amounts);

      // Additional liquidity
      const amounts_2 = [ethers.parseEther("50"), ethers.parseEther("50"), ethers.parseEther("50"), ethers.parseEther("50"), ethers.parseEther("50")];
      const tx = await pool.connect(user).addLiquidityMulti(amounts_2);

      // Expected LP tokens: 
      const expectedLP = amounts_2[0];
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(ethers.parseEther("150"));

      // Check reserves
      const [res0, res1] = await pool.getReserves();
      expect(res0).to.equal(amounts[0]+amounts_2[0]);
      expect(res1).to.equal(ethers.parseEther("150")); // 100 + 50

      // Check event
      const token_address_list = [await token0.getAddress(), await token1.getAddress(), await token2.getAddress(), await token3.getAddress(), await token4.getAddress()];
      await expect(tx)
        .to.emit(pool, "AddedLiquidityMulti")
        .withArgs(token_address_list, amounts_2, ethers.parseEther("50"));
    });

    it("should revert when adding zero liquidity", async function () {
      await expect(pool.connect(user).addLiquidityMulti([100, 0, 200, 100, 300]))
        .to.be.revertedWith("Amount must be greater than 0");
    });
  });
  describe("withdrawLiquidityMulti", function () {
    it("should withdraw liquidity and burn LP tokens", async function () {
      // Add initial liquidity
      const amounts = [ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100")];
      await pool.connect(user).addLiquidityMulti(amounts);
 
      const [res10, res11, res12, res13, res14] = await pool.getReservesMulti();
      expect(res10).to.equal(ethers.parseEther("100"));
      expect(res11).to.equal(ethers.parseEther("100"));
      expect(res12).to.equal(ethers.parseEther("100"));
      expect(res13).to.equal(ethers.parseEther("100"));
      expect(res14).to.equal(ethers.parseEther("100"));
      // Withdraw liquidity
      const amountLP = ethers.parseEther("100"); // Amount of LP tokens to withdraw
      const tx = await pool.connect(user).withdrawLiquidityMulti(amountLP);
  
      // Check LP tokens burned
      const lpBalance = await pool.balanceOf(user.address);
      expect(lpBalance).to.equal(0);

      // Check user tokens remain
      const initialBal0 = ethers.parseEther("1000");
      const finalBal0 = await token0.balanceOf(user.address);
      expect(finalBal0).to.equal(initialBal0); // 1000 - 100 + 100
  
      // Check reserves updated correctly
      const [res0, res1, res2, res3, res4] = await pool.getReservesMulti();
      const expectedRes0 = 0; // Proportional amount of token0
      expect(res0).to.equal(expectedRes0);
  
      // Check event emission
      const token_address_list = [await token0.getAddress(), await token1.getAddress(), await token2.getAddress(), await token3.getAddress(), await token4.getAddress()];
      await expect(tx)
        .to.emit(pool, "RemovedLiquidityMulti")
        .withArgs(token_address_list, amounts, amountLP);
    });
  
    it("should revert when withdrawing zero liquidity", async function () {
      await expect(pool.connect(user).withdrawLiquidity(0))
        .to.be.revertedWith("Amount must be greater than 0");
    });
  
    it("should revert when withdrawing more liquidity than owned", async function () {
      // Add initial liquidity
      const amounts = [ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100"), ethers.parseEther("100")];
      await pool.connect(user).addLiquidityMulti(amounts);
  
      // Attempt to withdraw more LP tokens than owned
      const amountLP = ethers.parseEther("200000"); // Exceeds user's LP balance
      await expect(pool.connect(user).withdrawLiquidity(amountLP))
        .to.be.revertedWith("Not enough LP tokens");
    });
  });
});
