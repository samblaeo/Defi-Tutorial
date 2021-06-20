const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

//All accounts from ganache
//The network from ganache

module.exports = async function(deployer, network, accounts) {

    //THIS PUT ALL THE SMART CONTRACT ON THE NETWORK

    //Deploy Mock DAI Token
    await deployer.deploy(DaiToken)

    //When the above line ends we fetch the token from the network (to get the address)
    const daiToken = await DaiToken.deployed()

    //Deploy Dapp Token
    await deployer.deploy(DappToken)

    //When the above line ends we fetch the token from the network (to get the address)
    const dappToken = await DappToken.deployed()

    //Deploy Token Farm

    //We deploy TokenFarm with the DappToken and DaiToken address
    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)

    const tokenFarm = await TokenFarm.deployed()

    //Transfer all tokens to TokenFarm (1 million) - (Method in the DappToken.sol)
    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

    //Transfer 100 Mock DAI tokens to investor - (Method in the DaiToken.sol) - accounts[1] is the second account on the ganache list
    await daiToken.transfer(accounts[1], '1000000000000000000000')
};