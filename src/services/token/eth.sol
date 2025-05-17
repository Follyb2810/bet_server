// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapLiquidity {
    address public owner;
    mapping(address => uint256) public balances;

    event SwapInitiated(address indexed user, uint256 amount, address token, string destinationChain);
    event SwapCompleted(address indexed user, uint256 amount, address token);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[token] += amount;
    }
function initiateSwap(address token, uint256 amount, string memory destinationChain) public {
        require(balances[token] >= amount, "Not enough liquidity");
        balances[token] -= amount;
        emit SwapInitiated(msg.sender, amount, token, destinationChain);
    }

    function completeSwap(address user, uint256 amount, address token) external onlyOwner {
        IERC20(token).transfer(user, amount);
        emit SwapCompleted(user, amount, token);
    }
}