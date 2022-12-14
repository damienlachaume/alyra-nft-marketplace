// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./GLTrail.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice Give the ability to deploy a contract to manage ERC-1155 tokens for a trail creator.
 * @dev    If the contract is already deployed for a _name, it will revert.
 */
contract GLTrailFactory is Ownable {
    mapping(address => uint256) public numberOfCollection;

    event GLTrailCreated(address _caller, string _name, address _address, uint _timestamp);
    event AddressWhitelisted(address _address);

    /**
     * @notice Deploy the ERC-1155 Collection contract of the creator caller to be able to create NFTs later
     *
     * @return collectionAddress the address of the created collection contract
     */
    function createNFTCollection(string memory _name) external returns (address collectionAddress) {
        require((bytes(_name).length != 0), "Collection's name is mandatory");

        numberOfCollection[msg.sender] += 1;

        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(GLTrail).creationCode;
        // Make a random salt based on the trail name
        bytes32 salt = keccak256(abi.encodePacked(_name));

        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        // Initialize the collection contract with the trail collection name
        GLTrail(collectionAddress).init(_name);

        // Transfer the ownership of the contract to the creator of the collection
        GLTrail(collectionAddress).transferOwnership(msg.sender);

        emit GLTrailCreated(msg.sender, _name, collectionAddress, block.timestamp);

        return (collectionAddress);
    }
}
