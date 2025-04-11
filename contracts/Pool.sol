// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LPToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Pool is LPToken, ReentrancyGuard {

    IERC20 immutable i_token0;
    IERC20 immutable i_token1;
    IERC20 immutable i_token2;
    IERC20 immutable i_token3;
    IERC20 immutable i_token4;

    address immutable i_token0_address;
    address immutable i_token1_address;
    address immutable i_token2_address;
    address immutable i_token3_address;
    address immutable i_token4_address;

    IERC20[] i_token_list;
    address[] token_address_list;
    string[] token_name_list;

    uint256 constant INITIAL_RATIO = 2; //token0:token1 = 1:2

    mapping(address => uint256) tokenBalances;

    event AddedLiquidity(
        uint256 indexed lpToken,
        address token0,
        uint256 indexed amount0,
        address token1,
        uint256 indexed amount1
    );

    event RemovedLiquidity(
        uint256 indexed lpToken,
        address token0,
        uint256 indexed amount0,
        address token1,
        uint256 indexed amount1
    );

    event Swapped(
        address tokenIn,
        uint256 indexed amountIn,
        address tokenOut,
        uint256 indexed amountOut
    );

    event AddedLiquidityMulti(
        address[] tokens,
        uint256[] amounts,
        uint256 liquidityMinted
    );

    event RemovedLiquidityMulti(
        address[] tokens,
        uint256[] amounts,
        uint256 liquidityBurned
    );

    constructor(address token0, address token1, address token2, address token3, address token4) LPToken("LPToken", "LPT") {

        i_token0 = IERC20(token0);
        i_token1 = IERC20(token1);
        i_token2 = IERC20(token2);
        i_token3 = IERC20(token3);
        i_token4 = IERC20(token4);

        i_token0_address = token0;
        i_token1_address = token1;
        i_token2_address = token2;
        i_token3_address = token3;
        i_token4_address = token4;

        token_address_list = [i_token0_address, i_token1_address, i_token2_address, i_token3_address, i_token4_address];
        token_name_list = ["Alpha", "Beta", "Poly", "ust", "x"];
        i_token_list = [IERC20(token0), IERC20(token1), IERC20(token2), IERC20(token3), IERC20(token4)];
    }

     function swap(address tokenIn, uint256 amountIn, address tokenOut) public nonReentrant {
        
        // input validity checks
        require(tokenIn != tokenOut, "Same tokens");
        require(tokenIn == i_token0_address || tokenIn == i_token1_address, "Invalid token");
        require(tokenOut == i_token0_address || tokenOut == i_token1_address, "Invalid token");
        require(amountIn > 0, "Zero amount");

        uint256 amountOut = getAmountOut(tokenIn, amountIn, tokenOut);

        // swapping tokens
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Swap Failed");
        require(IERC20(tokenOut).transfer(msg.sender, amountOut), "Swap Failed");
        
        // update pool balances
        tokenBalances[tokenIn] += amountIn;
        tokenBalances[tokenOut] -= amountOut;

        emit Swapped(tokenIn, amountIn, tokenOut, amountOut);

    }

    function addLiquidity(uint256 amount0) public nonReentrant {
    
        // input validity check
        require(amount0 > 0, "Amount must be greater than 0");
        
        // calculate and mint liquidity tokens
        uint256 amount1 = getRequiredAmount1(amount0);
        uint256 amountLP;
        if (totalSupply() > 0) {
            amountLP = (amount0 * totalSupply()) / tokenBalances[i_token0_address];
        } else {
            amountLP = amount0;
        }
        _mint(msg.sender, amountLP);

        // deposit token0
        require(i_token0.transferFrom(msg.sender, address(this), amount0), "Transfer Alpha failed");
        tokenBalances[i_token0_address] += amount0;
        
        // deposit token1
        require(i_token1.transferFrom(msg.sender, address(this), amount1), "Transfer Beta failed");
        tokenBalances[i_token1_address] += amount1;
        
        emit AddedLiquidity(amountLP, i_token0_address, amount0, i_token1_address, amount1);

    }
    function withdrawLiquidity(uint256 amount0) public nonReentrant{
        require(amount0 > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount0, "Not enough LP tokens");

        
        // calculate and mint liquidity tokens
        uint256 amount1 = getRequiredAmount1(amount0);
        uint256 amountLP;
        if(totalSupply()>0){
        amountLP = (amount0 * tokenBalances[i_token0_address]) / totalSupply();
        } else {
        amountLP = amount0;
        }

        _burn(msg.sender, amountLP);

        // update token balances
        require(i_token0.transfer(msg.sender, amount0), "Transfer Alpha failed");
        tokenBalances[i_token0_address] -= amount0;

        require(i_token1.transfer(msg.sender, amount1), "Transfer Beta failed");
        tokenBalances[i_token1_address] -= amount1;

        emit RemovedLiquidity(amountLP, i_token0_address, amount0, i_token1_address, amount1);
    }

    function getRequiredAmount1(uint256 amount0) public view returns(uint256) {

        uint256 balance0 = tokenBalances[i_token0_address];
        uint256 balance1 = tokenBalances[i_token1_address];
        
        if (balance0 == 0 || balance1 == 0) {
            return amount0 * INITIAL_RATIO;
        }
        return (amount0 * balance1) / balance0;

    }

    function getAmountOut(address tokenIn, uint256 amountIn, address tokenOut) public view returns (uint256) {
        uint256 balanceOut = tokenBalances[tokenOut];
        uint256 balanceIn = tokenBalances[tokenIn];

        require(balanceIn > 0, "Insufficient input amount");
        require(amountIn > 0 && balanceOut > 0, "Insufficient liquidity");

        uint256 amountInWithFee = amountIn * 997;
	    uint256 amountOut = (balanceOut * amountInWithFee) / (balanceIn * 1000 + amountInWithFee);
	return amountOut;

    }

    function getReserves() public view returns (uint256, uint256){
        return (tokenBalances[i_token0_address], tokenBalances[i_token1_address]);
    }

    function nRoot(uint256 x, uint256 n) internal pure returns (uint256) {
      uint256 result = 10e18;
      for (uint256 i = 0; i < 100; i++) {
          uint256 temp = ((n - 1) * result + x / (result ** (n - 1))) / n;
          if (temp >= result) break;
          result = temp;
      }
      return result;
    }

    function addLiquidityMulti(uint256[] calldata amounts) public nonReentrant {
    
        // calculate and mint liquidity tokens
        uint256 liquidity;
        if (totalSupply() == 0) {
            // first use sqrt
	    uint256 product = 1e18;
            for (uint256 i = 0; i < amounts.length; i++) {
                require(amounts[i] > 0, "Amount must be greater than 0");
                product = (product * amounts[i]) / 1e18;
		require(product > 0, "Product overflow");
            }
            //liquidity = nRoot(product, 5);
            //liquidity = Math.sqrt(Math.sqrt(product * 1e18));
	    liquidity = Math.sqrt(Math.sqrt(product * 1e36)) * 1e4;
        } else {
            // after use ratio
            uint256 minRatio = type(uint256).max;
            for (uint256 i = 0; i < amounts.length; i++) {
                uint256 reserve = tokenBalances[token_address_list[i]];
                if (reserve == 0) continue;
                uint256 ratio = (amounts[i] * 1e18) / reserve;
                if (ratio < minRatio) minRatio = ratio;
            }
            liquidity = minRatio * totalSupply() / 1e18;
        }
        require(liquidity > 0, "Insufficient liquidity");

        // update token amounts
        for (uint256 i = 0; i < amounts.length; i++) {
            if (amounts[i] == 0) continue;
            address token = token_address_list[i];
            tokenBalances[token] += amounts[i];
            require(i_token_list[i].transferFrom(msg.sender, address(this), amounts[i]), string.concat("Transfer failed: ", token_name_list[i]));
        }

        // get LP Token
        _mint(msg.sender, liquidity);
        emit AddedLiquidityMulti(token_address_list, amounts, liquidity);

    }
    function withdrawLiquidityMulti(uint256 liquidity) public nonReentrant{
        require(liquidity > 0, "Cannot burn 0 liquidity");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient balance");
        require(totalSupply() > 0, "No liquidity exists"); 
        // calculate token amounts
        uint256[] memory amounts = new uint256[](token_address_list.length);
        for (uint256 i = 0; i < token_address_list.length; i++) {
            if(totalSupply()>0) {
                amounts[i] = (tokenBalances[token_address_list[i]] * liquidity) / totalSupply();
                require(amounts[i] > 0, "Insufficient token reserve");
            } else {
                amounts[i] = liquidity;
            }
	    }
	    _burn(msg.sender, liquidity);
        // transfer token to user
        for (uint256 i = 0; i < token_address_list.length; i++) {
            if (amounts[i] > 0) {
		        tokenBalances[token_address_list[i]] -= amounts[i];
                require(i_token_list[i].transfer(msg.sender, amounts[i]), string.concat("Transfer failed: ", token_name_list[i]));
            }
        }
        
        // destory LP Token
        emit RemovedLiquidityMulti(token_address_list, amounts, liquidity);

    }
    
    function getReservesMulti() public view returns (uint256, uint256, uint256, uint256, uint256){
        return (tokenBalances[i_token0_address], tokenBalances[i_token1_address], tokenBalances[i_token2_address], tokenBalances[i_token3_address], tokenBalances[i_token4_address]);
    }

}
