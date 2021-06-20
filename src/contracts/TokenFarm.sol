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
    }

    // 1. Stakes Tokens (Deposit)

    function stakeTokens(uint _amount) public {

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

    // 2. Unstaking Tokens (Whitdraw)

    // 3. Issuing Tokens 
} 