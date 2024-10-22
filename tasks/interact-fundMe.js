
const {task}=require("hardhat/config")

task("interact-fundMe","interact with FundMe contract").addParam("addr","fundme contract address").setAction(async(taskArgs,hre)=>{

const fundMeFactory=await ethers.getContractFactory("FundMe")
const fundMe=fundMeFactory.attach(taskArgs.addr)
// init 2accounts
const[firstAccount,secondAccount]=await ethers.getSigners()

// fund contract with first account
const fundTx=await fundMe.fund({value:ethers.parseEther("0.5")})
await fundTx.wait()
// check balance of contract
const balanceOfContract=ethers.provider.getBalance(fundMe.target)
await console.log(`Balance of the contract is ${balanceOfContract}`)
// fund contract with second account
const fundTxWithSecondAccount=await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.5")})
await fundTxWithSecondAccount.wait()
// check balance of contract
const balanceOfContractAfterSecondFund=ethers.provider.getBalance(fundMe.target)
await console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)
//check mapping fundersToAmounts

const firstAccountBalanceInFundMe=await fundMe.fundersToAmount(firstAccount.address)
const secondAccountBalanceInFundMe=await fundMe.fundersToAmount(secondAccount.address)

console.log(`Balance of First account${firstAccount.address}is${firstAccountBalanceInFundMe}`)
console.log(`Balance of Second account${secondAccount.address}is${secondAccountBalanceInFundMe}`)
})
module.exports={}