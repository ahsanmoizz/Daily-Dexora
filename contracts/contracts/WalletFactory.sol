// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/accounts/SimpleAccountFactory.sol";

contract WalletFactory is SimpleAccountFactory {
    constructor(IEntryPoint _entryPoint)
        SimpleAccountFactory(_entryPoint) {}
}