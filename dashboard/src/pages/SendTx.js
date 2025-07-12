import React, { useState } from "react";
import { ethers } from "ethers";
import { createSignedUserOp } from "../sdk/src/signer.js"; // Adjust path as needed
import { useSidebar } from "../components/SidebarContext";
function SendTx() {
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const { collapsed } = useSidebar();
  // Temporary: Demo callData (any payable target contract call)
  const callData = "0x"; // ⚠️ Replace with actual contract call if needed

  const sendUserOp = async () => {
    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      // Setup local wallet for signing
      const privateKey = process.env.REACT_APP_SIGNER_PRIVATE_KEY; // or injected by wallet
      const rpc = process.env.REACT_APP_RPC_URL;

      const provider = new ethers.JsonRpcProvider(rpc);
      const wallet = new ethers.Wallet(privateKey, provider);
      const nonce = await provider.getTransactionCount(wallet.address);

      // Use SDK to create UserOp
      const userOp = await createSignedUserOp(wallet, callData, nonce);

      // Send to Bundler
      const res = await fetch("http://localhost:4000/userOp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userOp),
      });

      const result = await res.json();
      if (res.status !== 200) throw new Error(result.error);
      setTxHash("📦 Sent to bundler: " + JSON.stringify(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen bg-dexora p-10 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
      <div className="max-w-2xl mx-auto bg-[#111111] border border-gray-800 rounded-xl p-8 shadow">
        <h2 className="text-2xl font-bold text-indigo-500 mb-4">Send User Operation</h2>
        <button
          onClick={sendUserOp}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Gasless Transaction"}
        </button>

        {txHash && <p className="text-green-500 mt-4 break-all">{txHash}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default SendTx;
