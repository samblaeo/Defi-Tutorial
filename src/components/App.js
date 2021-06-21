import React, { Component } from 'react'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

  async componentWillMount() {

    await this.loadWeb3()

    await this.loadBlockchainData()
  }

  async loadBlockchainData() {

    const web3 = window.web3 //Creamos web3

    const accounts = await web3.eth.getAccounts() //Obtenemos todas las cuentas

    this.setState({ account: accounts[0] }) //Seteamos en el array state el objeto account con la cuenta conectada account[0]

    const networkId = await web3.eth.net.getId()//Obtenemos el id de la red

    /* ------------------------------------- SEPARATOR ------------------------------------- */

    //Load daiToken
    const daiTokenData = DaiToken.networks[networkId] //Cogemos el dato del token de la red cogida anteriormente

    if(daiTokenData) {

      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address) //Cogemos daiTokenData.address de DaiToken.abi (elemento en el json DaiToken.json)

      this.setState( { daiToken })

      // let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call() 
      //   //Buscamos en los métodos de daiToken y usamos el de 'balanceOf' y lo llamamos con 'call()' (Si da error en console es porque no hay ninguna cuenta conectada)
        
      // this.setState( { daiTokenBalance: daiTokenBalance.toString() } )
    } else {

      window.alert('DaiToken contract not deployed to detected network')
    }

    /* ------------------------------------- SEPARATOR ------------------------------------- */

    //Load dappToken
    const dappTokenData = DappToken.networks[networkId] //Cogemos el dato del token de la red cogida anteriormente

    if(dappTokenData) {

      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address) //Cogemos dappTokenData.address de DaiToken.abi (elemento en el json DaiToken.json)

      this.setState( { dappToken })

      // let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call() 
      //   //Buscamos en los métodos de dappToken y usamos el de 'balanceOf' y lo llamamos con 'call()' (Si da error en console es porque no hay ninguna cuenta conectada)
        
      // this.setState( { dappTokenBalance: dappTokenBalance.toString() } )
    } else {

      window.alert('DappToken contract not deployed to detected network')
    }

    /* ------------------------------------- SEPARATOR ------------------------------------- */

    //Load tokenFarm
    const tokenFarmData = TokenFarm.networks[networkId] //Cogemos el dato del token de la red cogida anteriormente

    if(tokenFarmData) {

      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address) //Cogemos tokenFarmData.address de DaiToken.abi (elemento en el json TokenFarm.json)

      this.setState( { tokenFarm })

      // let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call() 
      //   //Buscamos en los métodos de tokenFarm y usamos el de 'stakingBalance' y lo llamamos con 'call()' (Si da error en console es porque no hay ninguna cuenta conectada)
        
      // this.setState( { stakingBalance: stakingBalance.toString() } )
    } else {

      window.alert('TokenFarm contract not deployed to detected network')
    }

    /* ------------------------------------- SEPARATOR ------------------------------------- */

    this.setState( { loading: false } ) //When all is fetch the loading is false
  }

  //Load Web3 function
  async loadWeb3() {
    if (window.etheruem) {
      window.web3 = new Web3(window.etheruem)
      await window.etheruem.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non etheruem browser detected. You should consider trying to install metamask')
    }
  }

  /*
    TODO ESTO INTERACTUA CON LA BLOCKCHAIN

    - Añadimos como parámetro la cantidad

    - Ponemos el loading a true

    - Desde el daiToken (token a stakear) cogemos el método approve
    
    - Añadimos el address del tokenFarm (contrato donde se hace el stake)
    
    - Mandamos el método send con el address que hace el stake (this.state.account)
    
    - Cuando termina el evento 'transactionHash' llamamos al método stakeTokens de tokenFarm y le pasamos el amount
    
    - Mandamos el método send con el address que hace el stake (this.state.account)
    
    - Cuando termina el evento 'transactionHash' ponemos el loading a true

    */
  stakeTokens = (amount) => { 
    this.setState({ loading: true }) 
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  /*
    TODO ESTO INTERACTUA CON LA BLOCKCHAIN

    - Añadimos como parámetro la cantidad

    - Ponemos el loading a true

    - Desde el tokenFarm (token donde tenemos todo el staking) cogemos el método unstakeTokens
    
    - Lo madamos con el método send() desde el address 'this.state.account'
    
    - Cuando termina el evento 'transactionHash' ponemos el loading a false
  */

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)

    //We load all the tokens, token balances, staking balance and loading status to true at the begining
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true,
    }
  }

  render() {

    let content
    if(this.state.loading) {

        content = <p id="loader" className="text-center"> Loading... </p>
    } else {

        content = <Main 
              daiTokenBalance = { this.state.daiTokenBalance }
              dappTokenBalance = { this.state.dappTokenBalance }
              stakingBalance = { this.state.stakingBalance }
              stakeTokens = { this.stakeTokens }
              unstakeTokens = { this.unstakeTokens }
        />
    }

    return (
      <div>
        <Navbar account = { this.state.account } /> {/* Pasamos la propiedad account a la clase Navbar */}
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://shieldpad.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
