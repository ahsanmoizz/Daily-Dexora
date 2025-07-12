// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./BasePaymaster.sol";
import "./Helpers.sol";
import "./UserOperation.sol";
import "./PackedUserOperation.sol";

using UserOperationLib for PackedUserOperation;

contract Paymaster is BasePaymaster {
    mapping(address => bool) public whitelist;

    event Whitelisted(address indexed sender);
    event Revoked(address indexed sender);
constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
    _transferOwnership(msg.sender);
}
    function whitelistSender(address sender) external onlyOwner {
        whitelist[sender] = true;
        emit Whitelisted(sender);
    }

    function revokeSender(address sender) external onlyOwner {
        whitelist[sender] = false;
        emit Revoked(sender);
    }

    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32, /* userOpHash */
        uint256 /* maxCost */
    )
        internal
        override
        returns (bytes memory context, uint256 validationData)
    {
        require(whitelist[userOp.sender], " Sender not whitelisted");
        return ("", 0);
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) internal override {
        (mode, context, actualGasCost, actualUserOpFeePerGas); // unused params
        // subclass must override this method if validatePaymasterUserOp returns a context
        revert("must override");
    }

}
