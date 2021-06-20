const { assert } = require('chai');

const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {

    return web3.utils.toWei(n, 'Ether')
}

contract('TokenFarm', ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm;

    before(async() => {

        //Load Contracts

        daiToken = await DaiToken.new()

        dappToken = await DappToken.new()

        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //Transfer all Dapp tokens to farm (1 million)

        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        //Send tokens to investor

        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    //Write tests here

    describe('Mock Dai Token deployment', async() => {

        it('Has a name', async() => {

            const name = await daiToken.name()

            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async() => {

        it('Has a name', async() => {

            const name = await dappToken.name()

            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm Token deployment', async() => {

        it('Has a name', async() => {

            const name = await tokenFarm.name()

            assert.equal(name, 'Shield Token Farm')
        })

        it('contract has tokens', async() => {

            let balance = await dappToken.balanceOf(tokenFarm.address)

            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
})