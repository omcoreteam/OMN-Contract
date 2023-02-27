import fs from "fs";


export  async function readConfig(path : string)  {
    let config = fs.readFileSync(path);
    // @ts-ignore
    return JSON.parse(config);
}

export async  function writeConfig(path : string, config : any) {
    let data = JSON.stringify(config);
    fs.writeFileSync(path, data);
}



export async function verifyContract(
    hre : any,
    address : string,
    args : undefined | any[],
    contract : string | undefined
) {
    const verifyObj = { address } as any;
    if (args) {
        verifyObj.constructorArguments = args;
    }
    if (contract) {
        verifyObj.contract = contract;
    }
    return hre
        .run("verify:verify", verifyObj)
        .then(() => console.log("Contract address verified:", address))
        .catch((err : any) => {
            console.log(`Verify Error`, err);
        });
}
