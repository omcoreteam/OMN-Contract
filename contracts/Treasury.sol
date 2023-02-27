// SPDX-License-Identifier: BUSL-1.1

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOMN.sol";
pragma solidity ^0.8.9;

contract Treasury is Ownable {
    mapping(address => bool) public counterparties;
    IOMN public token;

    modifier onlyCounterparty() {
        require(counterparties[msg.sender], "Only counterparty can mint");
        _;
    }

    function setCounterparty(address counterparty) public onlyOwner {
        counterparties[counterparty] = true;
    }

    function revokeCounterparty(address counterparty) public onlyOwner {
        counterparties[counterparty] = false;
    }

    function mintToken(
        address recipient,
        uint256 amount
    ) public onlyCounterparty {
        token.mint(recipient, amount);
    }

    function setToken(IOMN token_) public onlyOwner {
        token = token_;
    }

}
