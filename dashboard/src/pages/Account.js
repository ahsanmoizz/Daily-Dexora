import React, { useEffect, useState } from "react";
import { fetchAccount } from "../utils/api";
import useProtectRoute from "../utils/protectRoute";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  useProtectRoute();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const id = localStorage.getItem("dev_id");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAccount(id);
        setAccount(data);
      } catch (err) {
        setError("Account not found or API down.");
      }
    }
    load();
  }, [id]);

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!account) return <p className="p-4">Loading account...</p>;

  return (
<div className="ml-64 min-h-screen p-10 bg-dexora relative z-10">

  <div className="max-w-4xl mx-auto bg-[#111111] rounded-xl border border-gray-800 shadow p-8">
    <h1 className="text-3xl font-bold mb-6 text-indigo-500">Developer Account</h1>

    <p className="text-gray-300 mb-2">
      <strong>Email/Wallet:</strong> {account.email || account.wallet}
    </p>
    <p className="text-gray-300 mb-2">
      <strong>API Key:</strong> <code className="bg-gray-800 px-2 py-1 rounded">{account.apiKey}</code>
    </p>
    <p className="text-gray-300 mb-6">
      <strong>Plan:</strong>{" "}
      <span className="font-semibold text-white">{account.plan === "pro" ? "Pro (Premium)" : "Free"}</span>
    </p>

    <div>
      {account.plan === "free" ? (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
          onClick={() => navigate("/upgrade")}
        >
          Upgrade to Pro
        </button>
      ) : (
        <p className="text-green-500 font-semibold">You’re on Pro Plan</p>
      )}
    </div>
  </div>
</div>
  )
}

export default AccountPage;
