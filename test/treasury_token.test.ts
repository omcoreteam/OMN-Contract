import {expect, use} from "chai";
import {OMNToken, Treasury} from "../typeChain";
import {deployContract, expectRevert, getAccount, toWei} from "./utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("test treasury and token", async function () {

    let token: OMNToken
    let treasury: Treasury
    let users: any[] = [];
    let deployer: SignerWithAddress;


    beforeEach(async () => {
        users = await getAccount() as unknown as SignerWithAddress[];
        deployer = users[0];

        treasury = await deployContract("Treasury")
        token = await deployContract("VesToken", deployer, treasury.address);

        await treasury.setToken(token.address)
    })

    describe("token test", async () => {
        it("should revert when mint", async () => {
            await expectRevert(token.mint(deployer.address, toWei(100)), "Only treasury")
        })

        it("should revert when mint max", async () => {
            await treasury.setCounterparty(deployer.address);

            await treasury.mintToken(deployer.address, toWei(70_000_000));

            let balanceUser = await token.balanceOf(deployer.address);

            expect(balanceUser).to.equal(toWei(70_000_000));

            await treasury.mintToken(deployer.address, toWei(900_000_000));

            balanceUser = await token.balanceOf(deployer.address);

            expect(balanceUser).to.equal(toWei(970_000_000));

            await expectRevert( treasury.mintToken(deployer.address,1), "ERC20Capped: cap exceeded")
        })


    })
})
