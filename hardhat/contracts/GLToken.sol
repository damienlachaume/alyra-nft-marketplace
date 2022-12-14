// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GLToken is ERC20 {
    mapping(address => uint256) public lastTransfers;

    event Faucet(address caller, address recipient);

    constructor(uint256 initialSupply) ERC20("Greencoin", "GC") {
        _mint(msg.sender, initialSupply);
    }

    function faucet(address recipient) external {
        require(lastTransfers[msg.sender] + 1 hours <= block.timestamp, "Wait at least one hour");
        lastTransfers[msg.sender] = block.timestamp;
        _mint(recipient, 100000000000000000000);
        emit Faucet(msg.sender, recipient);
    }
}
