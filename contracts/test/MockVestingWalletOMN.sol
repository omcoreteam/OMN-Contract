// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../implements/VestingWalletOMN.sol";

contract MockVestingWalletOMN is VestingWalletOMN {
    uint256 mockNow;

    constructor(
        address beneficiaryAddress,
        uint256 startTimeVesting,
        uint256 durationVesting,
        uint256 maxRelease,
        address vestToken
    )
        VestingWalletOMN(
            beneficiaryAddress,
            startTimeVesting,
            durationVesting,
            maxRelease,
            vestToken
        )
    {}

    function setNow(uint256 _now) public {
        mockNow = _now;
    }

    function now() internal view override returns (uint256) {
        return mockNow;
    }
}
