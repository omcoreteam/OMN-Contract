// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.9;

import "./implements/SaleBase.sol";

import "./implements/IDOVestingWalletOMN.sol";

contract IDOSale is SaleBase {
    uint256 internal _startTimeVesting;

    uint256 internal _durationVesting;

    uint256 internal _timeStampVest20Percent;


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
    ) {
        require(
            endTimeSale > startTimeSale && startTimeSale >= now(),
            "Time sale invalid"
        );
        require(startTimeVesting > endTimeSale, "Time vesting invalid");
        _price = 320; // 0.32 BUSD
        _busdAddress = addressBusd;
        _usdtAddress = addressUsdt;
        _vesAddress = addressVes;
        _pancakeRouterAddress = addressPancakeRouter;

        _startTimestamp = startTimeSale;
        _endTimestamp = endTimeSale;

        _startTimeVesting = startTimeVesting;
        _durationVesting = durationVesting;

        _maxSaleToken = 19_400_000 ether;

        _treasury = treasury;

        _timeStampVest20Percent = timeStampVest20Percent;
    }

    function _getVestingWalletAddress(
        address beneficiary,
        uint256 amountVes
    ) internal virtual override returns (address) {
        address existingWallet = _vestingWallets[beneficiary];

        if (existingWallet == address(0x0)) {
            uint256 _80percent = (amountVes * 80) / 100;
            uint256 _20Percent = amountVes - _80percent;
            IDOVestingWalletOMN wallet = new IDOVestingWalletOMN(
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

    function getStartVesting() public view returns (uint256) {
        return _startTimeVesting;
    }

    function getDurationVesting() public view returns (uint256) {
        return _durationVesting;
    }
}
