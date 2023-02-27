import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";

export async function deployContract<T>(
    artifactName: string,
    deployer?: SignerWithAddress,
    ...args: any[]
): Promise<T> {
    const [signer1] = await ethers.getSigners();
    deployer = deployer || signer1;
    const Contract = await ethers.getContractFactory(artifactName);
    const ins = await Contract.deploy(...args);
    await ins.connect(deployer).deployed();
    return ins as unknown as T;
}


export async function getAccount(): Promise<SignerWithAddress[]> {
    return ethers.getSigners();
}

export async function expectRevert(call: any, message: string) {
    await expect(call).to.revertedWith(message);
}


export function toWei(value: number | string | BigNumber) {
    return ethers.utils.parseEther(value.toString());
}

export function fromWei(value: BigNumber): Number {
    return Number(toEther(value.toString()));
}

export function toEther(value: number | string) {
    return ethers.utils.formatEther(value);
}
