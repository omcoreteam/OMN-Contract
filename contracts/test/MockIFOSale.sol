// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;
import "../IFOSale.sol";
import "./MockVestingWalletOMN.sol";

contract MockIFOSale is IFOSale {
    uint256 mockNow;

    constructor(
        ITreasury treasury,
        address addressBusd,
        address addressUsdt,
        address addressVes,
        address OMN,
        uint256 startTimeSale,
        uint256 endTimeSale,
        uint256 startTimeVesting,
        uint256 durationVesting
    )
        IFOSale(
            treasury,
            addressBusd,
            addressUsdt,
            addressVes,
            OMN,
            startTimeSale,
            endTimeSale,
            startTimeVesting,
            durationVesting
        )
    {}

    function _getVestingWalletAddress(
        address beneficiary,
        uint256 amountVes
    ) internal override returns (address) {
        address existingWallet = _vestingWallets[beneficiary];

        if (existingWallet == address(0x0)) {
            MockVestingWalletOMN wallet = new MockVestingWalletOMN(
                beneficiary,
                _startTimeVesting,
                _durationVesting,
                amountVes,
                _vesAddress
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
