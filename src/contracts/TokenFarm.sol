pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

/**

Deployment process:

- Step 1: Deploy Dai
- Step 2: Deploy Dapp
- Step 3: Deploy TokenFarm

 */
contract TokenFarm {

    //All code goes here

    string public name = "Shield Token Farm";

    DappToken public dappToken;

    DaiToken public daiToken;

    address public owner;

    address [] public stakers;

    mapping(address => uint) public stakingBalance;

    mapping(address => bool) public hasStaked;

    mapping(address => bool) public isStaking;

    /**
        El contrato está creado con dappToken y daiToken (el contrato recibirá _dappToken y generará _daiToken)
    */
    constructor(DappToken _dappToken, DaiToken _daiToken) public {

        dappToken = _dappToken;

        daiToken = _daiToken;

        owner = msg.sender;
    }

    // 1. Stakes Tokens (Deposit)

    function stakeTokens(uint _amount) public {

        require(_amount > 0, "ammount can't be 0"); //Añadimos el requisito de que pueda stakear 0 tokens y entrar en el array de stakers

        // Transfer Mock Dai tokens to this contract for Staking
        daiToken.transferFrom(msg.sender, address(this), _amount); 
            //Function in the DaiToken.app | msg.sender - Variable global | address(this) - para apuntar a la dirección de este contrato | Amount - cantidad

        //Update Stakin Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
            //Asignamos el balance del staking con el _amount. Tenemos que sumarlo por si el usuario ya tiene tokens en stake

        //Add users to stakers array *only if they haven't staked already*

        if(!hasStaked[msg.sender])
            stakers.push(msg.sender);
            //Si el (msg.sender = address en ese momento conectada) no tiene nada en stake, lo añadimos al array. Sino nada (ya se añadió)

        hasStaked[msg.sender] = true;
            //Le añadimos true a hasStaked con esta address (msg.sender)

        isStaking[msg.sender] = true;
            //Le añadimos true a isStaking con esta address (msg.sender)
    }

    // 2. Issuing Tokens (Rewards)

    function issueTokens() public { 
        
        require(msg.sender == owner, "caller must be the owner"); //Solo el owner podrá llamar a esta funcion

        //Recorremos todas las address que hay haciendo staking (stakers)
        for(uint ii = 0; ii < stakers.length; ii++) {

            address recipient = stakers[ii]; //Cogemos el staker

            uint balance = stakingBalance[recipient]; //Cogemos su balance de daiToken 

            if(balance > 0)
                dappToken.transfer(recipient, balance); //Le asignamos la misma cantidad de dappToken que el balance de daiToken
        } 
    }

    // 3. Unstaking Tokens (Whitdraw)

    function unstakeTokens() public {

        //Cogemos el balance del staking
        uint balance = stakingBalance[msg.sender];

        //Añadimos el requisito de que el balance de lo stakeado sea mayor que 0 tokens
        require(balance > 0, "staking balance can't be 0"); 

        //Transferimos los dai tokens que se stakearon en su momento de vuelta al user
        daiToken.transfer(msg.sender, balance);

        //Reseteamos el stake a 0
        stakingBalance[msg.sender] = 0;

        //El usuario ya no está stakeando
        isStaking[msg.sender] = false;
    }
} 