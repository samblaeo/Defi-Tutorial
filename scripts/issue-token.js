const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {

    let tokenFarm = await TokenFarm.deployed()

    await tokenFarm.issueTokens()

    //Code goes here...
    console.log('Token issued!')

    callback()
};