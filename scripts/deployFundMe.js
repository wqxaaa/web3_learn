// import ethers.js
// create main function
// execute main function

const {ethers}=require("hardhat")


async function main(){
// create factory
const fundMeFactory=await ethers.getContractFactory("FundMe")
// deploy contract from factory
const fundMe=await fundMeFactory.deploy(300)
// 为了使其在不同的网络执行不同的逻辑
//验证合约
if(hre.network.config.chainId==11155111&&process.env.ETHERSCAN_API_KEY){
await fundMe.waitForDeployment()
console.log(`contract has been deployed successfully,contract address is ${fundMe.target}`);
await fundMe.deploymentTransaction().wait(5)
console.log("waiting for 5 confirmations")
await hre.run("verify:verify", {
    address: fundMe.target,
    constructorArguments: [300,],
  });
}else{
    console.log("verification skipped")
}

// init 2accounts
const[firstAccount,secondAccount]=await ethers.getSigners()

// fund contract with first account
const fundTx=await fundMe.fund({value:ethers.parseEther("0.5")})
await fundTx.wait()
// check balance of contract
const balanceOfContract=ethers.provider.getBalance(fundMe.target)
console.log(`Balance of the contract is ${balanceOfContract}`)
// fund contract with second account
const fundTxWithSecondAccount=await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.5")})
await fundTxWithSecondAccount.wait()
// check balance of contract
const balanceOfContractAfterSecondFund=ethers.provider.getBalance(fundMe.target)
console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)
//check mapping fundersToAmounts

const firstAccountBalanceInFundMe=await fundMe.fundersToAmount(firstAccount.address)
const secondAccountBalanceInFundMe=await fundMe.fundersToAmount(secondAccount.address)

console.log(`Balance of First account${firstAccount.address}is${firstAccountBalanceInFundMe}`)
console.log(`Balance of Second account${secondAccount.address}is${secondAccountBalanceInFundMe}`)


}

main().then((error)=> {
    console.error(error)
    process.exit(1)
});