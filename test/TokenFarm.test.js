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

    describe('Farming tokens', async() => {

        it('Rewards investor for staking mDai tokens', async() => {

            let result

            //Check investor balance before staking
            result = await daiToken.balanceOf(investor)

            assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking')

            /* ---------------------------------- */

            //Stake Mock DAI Tokens

            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
                //Aprobamos la transacción antes de comprobar (Se pasan daiToken al contrato de tokenFarm donde stakeamos DaiToken y obtenemos DappToken)

            await tokenFarm.stakeTokens(tokens('100'), { from: investor })
                //Stakeamos los tokens 

            /* ---------------------------------- */

            //Check staking result

            result = await daiToken.balanceOf(investor)

            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')
                //Investor debe de tener 0 tokens en su balance porque debe de tenerlos todos en el stake

            /* ---------------------------------- */

            result = await daiToken.balanceOf(tokenFarm.address)

            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')
                //TokenFarm debe de tener 100 tokens en su balance porque se han stakeado anteriormente 

            /* ---------------------------------- */

            result = await tokenFarm.stakingBalance(investor) //stakingBalance es el nombre del mapping (SE LE PASA EL ADDRESS PORQUE LO INDICAMOS EN EL MAPPING)

            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')
                //Investor debe de tener 100 tokens en el contrato donde se está el stake (SE LE PASA EL ADDRESS PORQUE LO INDICAMOS EN EL MAPPING)

            /* ---------------------------------- */

            result = await tokenFarm.isStaking(investor) //isStaking es el nombre del mapping

            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
                //Investor debe de tener 100 tokens en el contrato donde se está el stake
        })


    })
})