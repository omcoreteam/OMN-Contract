// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./VestingWalletOMN.sol";

contract IDOVestingWalletOMN is VestingWalletOMN {
    uint256 private _amountVes20Percent;
    uint256 private _timeStampVest20Percent;

    event Vesting20Percent(
        address beneficiary,
        uint256 amount,
        uint256 timeStamp
    );

    constructor(
        address beneficiaryAddress,
        uint256 startTimeVesting,
        uint256 durationVesting,
        uint256 amountVes,
        address vesToken,
        uint256 amountVes20Percent,
        uint256 timeStampVest20Percent
    )
        VestingWalletOMN(
            beneficiaryAddress,
            startTimeVesting,
            durationVesting,
            amountVes,
            vesToken
        )
    {
        _amountVes20Percent = amountVes20Percent;
        _timeStampVest20Percent = timeStampVest20Percent;
    }

    function vesting20Percent() public {
        require(
            now() >= _timeStampVest20Percent,
            "Not reach time vesting 20 percent"
        );

        if (!isAlreadyVesting20Percent()) {
            IERC20(_vestToken).transfer(_beneficiary, _amountVes20Percent);

            _amountVes20Percent = 0;
            emit Vesting20Percent(_beneficiary, now(), _amountVes20Percent);
        }
    }

    function isAlreadyVesting20Percent() public view returns (bool) {
        return _amountVes20Percent == 0;
    }

    function amountVes20Percent() public view returns (uint256) {
        return _amountVes20Percent;
    }

    function timeStampVest20Percent() public view returns (uint256) {
        return _timeStampVest20Percent;
    }
}
