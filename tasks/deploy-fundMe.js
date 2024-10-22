const {task}=require("hardhat/config")

task("deploy-fundMe","deploy and verify fundMe contract").setAction(async(taskArgs,hre)=>{
// create factory
const fundMeFactory=await ethers.getContractFactory("FundMe")
// deploy contract from factory
const fundMe=await fundMeFactory.deploy(500)
// 为了使其在不同的网络执行不同的逻辑
//验证合约
if(hre.network.config.chainId==11155111&&process.env.ETHERSCAN_API_KEY){
await fundMe.waitForDeployment()
console.log(`contract has been deployed successfully,contract address is ${fundMe.target}`);
await fundMe.deploymentTransaction().wait(5)
console.log("waiting for 5 confirmations")
await hre.run("verify:verify", {
    address: fundMe.target,
    constructorArguments: [500,],
  });
}else{
    console.log("verification skipped")
}

})

module.exports={}
