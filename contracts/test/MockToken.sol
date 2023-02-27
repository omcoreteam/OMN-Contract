// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address user, uint256 amount) public {
        _mint(user, amount);
    }
}
