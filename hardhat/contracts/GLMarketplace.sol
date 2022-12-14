// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC1155.sol";

contract GLMarketPlace {
    IERC20 public token;

    struct Listing {
        uint256 price;
        uint256 quantity;
    }

    mapping(address => mapping(address => mapping(uint => Listing))) public listings; // address of seller => address of nft contract => id of token

    event TrailListed(address seller, address nftAddress, uint256 tokenId, uint256 price, uint256 quantity);
    event TrailCanceled(address seller, address nftAddress, uint256 tokenId, uint256 quantity);
    event TrailBought(address seller, address buyer, address nftAddress, uint256 tokenId, uint256 price);

    constructor(address _tokenaddress) {
        token = IERC20(_tokenaddress);
    }

    modifier hasEnough(
        address nftAddress,
        uint256 tokenId,
        address holder,
        uint256 quantity
    ) {
        IERC1155 nft = IERC1155(nftAddress);
        uint256 balance = nft.balanceOf(holder, tokenId);
        require(balance >= quantity, "Not enough token");
        _;
    }

    modifier callerCanCancel(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[msg.sender][nftAddress][tokenId];
        require(listing.quantity > 0, "You have zero token listed");
        _;
    }

    function list(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        uint256 quantity
    ) external hasEnough(nftAddress, tokenId, msg.sender, quantity) {
        require(price > 0, "Price must be higher than 0");
        require(
            IERC1155(nftAddress).isApprovedForAll(msg.sender, address(this)),
            "Marketplace is not approved by NFT contract"
        );

        listings[msg.sender][nftAddress][tokenId] = Listing(price, quantity);
        emit TrailListed(msg.sender, nftAddress, tokenId, price, quantity);
    }

    function cancel(address nftAddress, uint256 tokenId) external callerCanCancel(nftAddress, tokenId) {
        uint256 quantity = listings[msg.sender][nftAddress][tokenId].quantity;
        delete listings[msg.sender][nftAddress][tokenId];
        emit TrailCanceled(msg.sender, nftAddress, tokenId, quantity);
    }

    function buy(address seller, address nftAddress, uint256 tokenId) external {
        require(
            token.balanceOf(msg.sender) >= listings[seller][nftAddress][tokenId].price,
            "Your balance is insufficient"
        );

        // Get the listing
        Listing memory listedItem = listings[seller][nftAddress][tokenId];

        // Decrement the quantity of NFT's remaining
        listings[seller][nftAddress][tokenId].quantity -= 1;
        if (listings[seller][nftAddress][tokenId].quantity == 0) {
            delete (listings[seller][nftAddress][tokenId]);
        }

        // Payment in ERC20 token
        token.transferFrom(msg.sender, address(seller), listings[seller][nftAddress][tokenId].price);

        // Transfer of one NFT to the buyer
        IERC1155(nftAddress).safeTransferFrom(seller, msg.sender, tokenId, 1, "");

        emit TrailBought(seller, msg.sender, nftAddress, tokenId, listedItem.price);
    }
}
