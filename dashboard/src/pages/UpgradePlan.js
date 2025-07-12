import React, { useEffect, useState } from "react";
import useProtectRoute from "../utils/protectRoute";

function UpgradePlan() {
  useProtectRoute();

  const [plans, setPlans] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/admin/all-plans")
      .then((res) => res.json())
      .then(setPlans);
  }, []);

  const handleUpgrade = async () => {
    const devId = localStorage.getItem("dev_id");
    if (!devId || !selectedPlan) {
      alert("Please login and select a plan");
      return;
    }

    const res = await fetch("http://localhost:5001/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dev_id: devId, planName: selectedPlan }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen p-10 bg-dexora">
      <div className="max-w-xl mx-auto bg-[#111] border border-gray-800 rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-indigo-500 mb-6">Upgrade Plan</h1>

        <select
          className="w-full mb-6 p-2 rounded text-black"
          onChange={(e) => setSelectedPlan(e.target.value)}
          value={selectedPlan}
        >
          <option value="">-- Select Plan --</option>
          {Object.entries(plans).map(([name, p]) => (
            <option key={name} value={name}>
              {name} — ₹{p.price} / {p.txLimit} txs
            </option>
          ))}
        </select>

        <button
          onClick={handleUpgrade}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded"
        >
          Upgrade to {selectedPlan || "..." }
        </button>
      </div>
    </div>
  );
}

export default UpgradePlan;
