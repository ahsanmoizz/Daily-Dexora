// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/accounts/SimpleAccount.sol";

contract SmartWallet is SimpleAccount {
    constructor(IEntryPoint _entryPoint, address _owner)
        SimpleAccount(_entryPoint) {}
}
