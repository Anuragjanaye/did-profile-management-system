// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProfileRegistry
 * @dev Registry for mapping Ethereum addresses to their Decentralized Identity Profile CIDs.
 */
contract ProfileRegistry {
    // Mapping from user wallet address to their IPFS CID
    mapping(address => string) public profileCIDs;

    // Event emitted when a profile is updated
    event ProfileUpdated(address indexed user, string cid, uint256 timestamp);

    /**
     * @dev Register or update the IPFS CID for the caller's profile.
     * @param _cid The IPFS CID string.
     */
    function registerProfile(string calldata _cid) external {
        require(bytes(_cid).length > 0, "CID cannot be empty");

        profileCIDs[msg.sender] = _cid;

        emit ProfileUpdated(msg.sender, _cid, block.timestamp);
    }

    /**
     * @dev Get the profile CID for a specific user.
     * @param _user The address of the user.
     * @return The IPFS CID string.
     */
    function getProfile(address _user) external view returns (string memory) {
        return profileCIDs[_user];
    }
}
