// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "../IFOSale.sol";
import "./MockVestingWalletOMN.sol";
import "../IDOSale.sol";
import "./MockIDOVestingWalletOMN.sol";

contract MockIDOSale is IDOSale {
    uint256 mockNow;

    constructor(
        ITreasury treasury,
        address addressBusd,
        address addressUsdt,
        address addressVes,
        address addressPancakeRouter,
        uint256 startTimeSale,
        uint256 endTimeSale,
        uint256 startTimeVesting,
        uint256 durationVesting,
        uint256 timeStampVest20Percent

    )
        IDOSale(
            treasury,
            addressBusd,
            addressUsdt,
            addressVes,
            addressPancakeRouter,
            startTimeSale,
            endTimeSale,
            startTimeVesting,
            durationVesting,
            timeStampVest20Percent
        )
    {}

    function _getVestingWalletAddress(
        address beneficiary,
        uint256 amountVes
    ) internal override returns (address) {
        address existingWallet = _vestingWallets[beneficiary];

        if (existingWallet == address(0x0)) {
            uint256 _80percent = (amountVes * 80) / 100;
            uint256 _20Percent = amountVes - _80percent;
            MockIDOVestingWalletOMN wallet = new MockIDOVestingWalletOMN(
                beneficiary,
                _startTimeVesting,
                _durationVesting,
                _80percent,
                _vesAddress,
                _20Percent,
                _timeStampVest20Percent
            );

            address walletAddress = address(wallet);
            _vestingWallets[beneficiary] = walletAddress;

            return walletAddress;
        } else {
            return existingWallet;
        }
    }

    function setNow(uint256 _now) public {
        mockNow = _now;
    }

    function now() internal view override returns (uint256) {
        return mockNow;
    }
}
