import React, { useState } from "react";
import { ethers } from "ethers";
import useProtectRoute from "../utils/protectRoute";

function Wallet() {
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
useProtectRoute();
  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      setConnected(true);
    }
  }

  return (
   <div className="ml-64 min-h-screen bg-dexora p-10 relative z-10">
      <h2 className="text-2xl mb-4 text-indigo-300">Smart Wallet Interface</h2>
      <button
        onClick={connectWallet}
        className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700"
      >
        {connected ? "Connected" : "Connect Wallet"}
      </button>
      {connected && <p className="mt-4 text-sky-300">Address: {address}</p>}
    </div>
  );
}

export default Wallet;
