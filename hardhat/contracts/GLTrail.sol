// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@thirdweb-dev/contracts/eip/ERC1155.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC1155Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GLTrail is ERC1155, IERC1155Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    event Init(address caller, string name);
    event Minted(address minter, uint256 tokenId, string tokenURI, uint256 quantity);

    constructor() ERC1155("", "") {}

    function init(string calldata _name) public onlyOwner {
        name = _name;

        emit Init(msg.sender, _name);
    }

    function mint(string calldata tokenURI, uint256 quantity) external onlyOwner returns (uint) {
        require(quantity > 0, "Make sure the quantity higher than zero");
        require(_tokenIds.current() + 1 <= 5, "Not allowed to mint more than 5 differents trail by collection");
        require(quantity <= 20, "You cannot mint more than 20 exemplaries of your trail");

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _mint(msg.sender, currentTokenId, quantity, "");

        _setTokenURI(currentTokenId, tokenURI);

        emit Minted(msg.sender, currentTokenId, tokenURI, quantity);

        return currentTokenId;
    }

    function nextTokenIdToMint() external view override returns (uint256) {
        uint256 nextTokenId = _tokenIds.current() + 1;
        return nextTokenId;
    }
}
