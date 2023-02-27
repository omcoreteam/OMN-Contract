// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "../implements/IDOVestingWalletOMN.sol";

contract MockIDOVestingWalletOMN is IDOVestingWalletOMN {
    uint256 mockNow;

    constructor(
        address beneficiaryAddress,
        uint256 startTimeVesting,
        uint256 durationVesting,
        uint256 maxRelease,
        address vestToken,
        uint256 amountVes20Percent,
        uint256 timeStampVest20Percent
    )
        IDOVestingWalletOMN(
            beneficiaryAddress,
            startTimeVesting,
            durationVesting,
            maxRelease,
            vestToken,
            amountVes20Percent,
            timeStampVest20Percent
        )
    {}

    function setNow(uint256 _now) public {
        mockNow = _now;
    }

    function now() internal view override returns (uint256) {
        return mockNow;
    }
}
