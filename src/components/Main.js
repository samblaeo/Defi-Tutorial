import React, { Component } from 'react'
import dai from '../dai.png'

class Navbar extends Component {

    render() {
        return (
            <div id="content" className="mt-3">

                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                            {/* Cogememos el staking balance alojado en las props (pasadas desde App.js) y lo introducimos en el método 'fromWei' de web3.utils */}
                            <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
                            {/* Cogememos balance de tokens dapp alojado en las props (pasadas desde App.js) y lo introducimos en el método 'fromWei' de web3.utils */}
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4">

                    <div className="card-body">

                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount
                            amount = this.input.value.toString() // Coge los tokens del formulario (gracias al 'ref' del input)
                            amount = window.web3.utils.toWei(amount, 'Ether') //Los convierte al formato Wei (cantidad + 18ceros)
                            this.props.stakeTokens(amount) //Añade esos tokens convertidos a la propiedad stakeTokens
                        }}>
                            <div>
                                <label className="float-left"><b>Stake Tokens</b></label>
                                <span className="float-right text-muted">
                                    Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                                    {/* Cogememos balance de tokens dai alojado en las props (pasadas desde App.js) y lo introducimos en el método 'fromWei' de web3.utils */}
                                </span>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    ref={(input) => { this.input = input }} //Añadimos input como una variable 
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <img src={dai} height='32' alt="" />
                                        &nbsp;&nbsp;&nbsp; mDAI
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                        </form>

                        <button
                            type="submit"
                            className="btn btn-secondary btn-block btn-lg"
                            onClick={(event) => {
                                event.preventDefault()
                                this.props.unstakeTokens()
                            }}>
                            UNSTAKE
                        </button>


                    </div>
                </div>

            </div>
        );
    }
}

export default Navbar;
