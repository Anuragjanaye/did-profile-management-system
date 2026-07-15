// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ProfileRegistry.sol";

contract ProfileRegistryTest is Test {
    ProfileRegistry public registry;

    function setUp() public {
        registry = new ProfileRegistry();
    }

    function test_RegisterProfile() public {
        string memory cid = "QmTestCID123";
        
        vm.expectEmit(true, false, false, true);
        emit ProfileRegistry.ProfileUpdated(address(this), cid, block.timestamp);
        
        registry.registerProfile(cid);

        assertEq(registry.getProfile(address(this)), cid);
    }

    function test_RevertEmptyCID() public {
        vm.expectRevert("CID cannot be empty");
        registry.registerProfile("");
    }
}
