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

    /**
        The contract is created with the dappToken and daiToken (contract it will receive and contract it will create)
    */
    constructor(DappToken _dappToken, DaiToken _daiToken) public {

        dappToken = _dappToken;

        daiToken = _daiToken;
    }

    
} 