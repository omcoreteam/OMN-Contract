import {
    MockIDOSale,
    MockIDOVestingWalletOMN,
    MockIFOSale,
    MockToken,
    MockVestingWalletOMN,
    OMNToken,
    Treasury
} from "../typeChain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {deployContract, expectRevert, getAccount, toWei} from "./utils";
import {expect} from "chai";


describe("IFO sale", async () => {


    let token: OMNToken
    let treasury: Treasury
    let IFO : MockIFOSale
    let IDO : MockIDOSale
    let users: any[] = [];
    let deployer: SignerWithAddress;
    let busd :MockToken
    let usdt :MockToken
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let vestingWalletInstance : MockVestingWalletOMN
    let vestingIDOWalletInstance : MockIDOVestingWalletOMN

    beforeEach(async () => {
        users = await getAccount() as unknown as SignerWithAddress[];
        deployer = users[0];
        user1 = users[1];
        user2 = users[2];

        treasury = await deployContract("Treasury")
        token = await deployContract("OMNToken", deployer, treasury.address);
        busd = await deployContract("MockToken", deployer, "BUSD", "BUSD");
        usdt = await deployContract("MockToken", deployer, "USDT", "USDT");

        vestingWalletInstance = await deployContract("MockVestingWalletOMN", deployer,deployer.address, 1,1,1, deployer.address)

        vestingIDOWalletInstance = await deployContract("MockIDOVestingWalletOMN", deployer,deployer.address, 1,1,1, deployer.address, 1,1)


        await treasury.setToken(token.address)

        IFO = await deployContract("MockIFOSale", deployer, treasury.address, busd.address, usdt.address, token.address,token.address, 10, 20, 30, 10);
        IDO = await deployContract("MockIDOSale", deployer, treasury.address, busd.address, usdt.address, token.address,token.address, 10, 20, 30, 10, 25);

        await busd.connect(user1).approve(IFO.address, toWei("99999999999999999999999999999999999999"))
        await busd.connect(user1).approve(IDO.address, toWei("99999999999999999999999999999999999999"))
        await busd.connect(user1).mint(user1.address, toWei("100000000000000"));
        await busd.connect(user2).approve(IFO.address, toWei("99999999999999999999999999999999999999"))
        await busd.connect(user2).approve(IDO.address, toWei("99999999999999999999999999999999999999"))
        await busd.connect(user2).mint(user2.address, toWei("100000000000000"));


        await usdt.connect(user1).approve(IFO.address, toWei("99999999999999999999999999999999999999"))
        await usdt.connect(user1).approve(IDO.address, toWei("99999999999999999999999999999999999999"))
        await usdt.connect(user1).mint(user1.address, toWei("100000000000000"));
        await usdt.connect(user2).approve(IFO.address, toWei("99999999999999999999999999999999999999"))
        await usdt.connect(user2).approve(IDO.address, toWei("99999999999999999999999999999999999999"))
        await usdt.connect(user2).mint(user2.address, toWei("100000000000000"));


        await treasury.setCounterparty(IFO.address);
        await treasury.setCounterparty(IDO.address);
    })

    describe("buy token", async () => {
        it("should buy token", async () => {
            // can not buy when not reach start time
            await expectRevert(IFO.connect(user1).buyTokenBUSD(toWei("1")), "Sale isn't running yet")
            await expectRevert(IFO.connect(user1).buyTokenUSDT(toWei("1")), "Sale isn't running yet")

            await IFO.setNow(10);
            await IFO.connect(user1).buyTokenBUSD(toWei("11"))

            const vestingWallet = await IFO.connect(user1).vestingWallet(user1.address);


            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("100"))

            await IFO.connect(user1).buyTokenBUSD(toWei("11"))

            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("200"))

            await IFO.connect(user1).buyTokenUSDT(toWei("11"))

            await expectRevert(IFO.connect(user1).buyTokenUSDT(toWei("0")), "Amount must be greater than 0")

            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("300"))
            expect((await IFO.soldToken()).toString()).to.equal(toWei("300"))

            // time over

            await IFO.setNow(20);
            await expectRevert(IFO.connect(user1).buyTokenBUSD(toWei("1")), "Sale was already finished")
            await expectRevert(IFO.connect(user1).buyTokenUSDT(toWei("1")), "Sale was already finished")
        })

        it("should sold out",async ()=>{

            await IFO.setNow(11);
            await IFO.connect(user1).buyTokenBUSD(toWei("110"))
            const vestingWallet = await IFO.connect(user1).vestingWallet(user1.address);

            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("1000"))

            await IFO.connect(user1).buyTokenBUSD(toWei("5114890"))

            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("46500000"))
            expect((await IFO.soldToken()).toString()).to.equal(toWei("46500000"))

            await expectRevert(IFO.connect(user1).buyTokenUSDT(toWei("1")), "Already reach max amount sale this phase")

        })
    })

    describe("vesting wallet", async () => {
        it("should vesting when buy one time",async ()=>{
            await IFO.setNow(10);
            await IFO.connect(user1).buyTokenBUSD(toWei("110"))
            const vestingWallet = await IFO.connect(user1).vestingWallet(user1.address);
            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("1000"))


            // vesting 0 amount when not reach time start
            await IFO.setNow(21);
            const _vestingInstance = vestingWalletInstance.attach(vestingWallet.toString());


            console.log((await _vestingInstance.start()).toString())

            await _vestingInstance.setNow(21);

            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(0)

            await _vestingInstance.setNow(30);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(0)

            await _vestingInstance.setNow(31);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("100"))
            expect((await _vestingInstance.remainingRelease())).to.equal(toWei("900"))
            expect((await _vestingInstance["released()"]())).to.equal(toWei("100"))


            await _vestingInstance.setNow(35);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("500"))
            expect((await _vestingInstance.remainingRelease())).to.equal(toWei("500"))


            await _vestingInstance.setNow(41);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("1000"))


        })

        it("should vesting when buy many time",async ()=>{
            await IFO.setNow(10);
            await IFO.connect(user1).buyTokenBUSD(toWei("110"))
            await IFO.setNow(11);
            await IFO.connect(user1).buyTokenBUSD(toWei("220"))

            const vestingWallet = await IFO.connect(user1).vestingWallet(user1.address);
            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("3000"))


            // vesting 0 amount when not reach time start
            await IFO.setNow(21);
            const _vestingInstance = vestingWalletInstance.attach(vestingWallet.toString());


            console.log((await _vestingInstance.start()).toString())

            await _vestingInstance.setNow(21);

            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(0)

            await _vestingInstance.setNow(30);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(0)

            /// Vesting first time
            await _vestingInstance.setNow(31);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("300"))
            expect((await _vestingInstance.remainingRelease())).to.equal(toWei("2700"))


            /// Vesting 2 time
            await _vestingInstance.setNow(35);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("1500"))
            expect((await _vestingInstance.remainingRelease())).to.equal(toWei("1500"))


            await _vestingInstance.setNow(41);
            await _vestingInstance.connect(user1).release();
            expect((await token.balanceOf(user1.address))).to.equal(toWei("3000"))
            expect((await _vestingInstance.remainingRelease())).to.equal(toWei("0"))


        })
        it("should vesting 20%", async ()=>{
            await IDO.setNow(10);
            await IDO.connect(user1).buyTokenBUSD(toWei("320"))
            const vestingWallet = await IDO.connect(user1).vestingWallet(user1.address);
            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("1000"))

            const _vestingInstance = vestingIDOWalletInstance.attach(vestingWallet.toString());

            expect((await _vestingInstance.isAlreadyVesting20Percent())).to.equal(false)
            await expectRevert(_vestingInstance.connect(user1).vesting20Percent(), "Not reach time vesting 20 percent")
            expect((await _vestingInstance.amountVes20Percent())).to.equal(toWei("200"))
            expect((await _vestingInstance.maxRelease())).to.equal(toWei("800"))
            await _vestingInstance.setNow(25);

            await _vestingInstance.connect(user1).vesting20Percent();
            expect((await _vestingInstance.amountVes20Percent())).to.equal(toWei("0"))
            expect((await _vestingInstance.isAlreadyVesting20Percent())).to.equal(true)

            expect((await token.balanceOf(vestingWallet.toString())).toString()).to.equal(toWei("800"))

        })
    })
})
