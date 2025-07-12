import React, { useEffect, useState } from "react";
import useProtectRoute from "../utils/protectRoute";
import { useSidebar } from "../components/SidebarContext";
function TxHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const { collapsed } = useSidebar();

useProtectRoute();
  const devId = localStorage.getItem("dev_id");

  useEffect(() => {
    async function fetchTxHistory() {
      try {
        const res = await fetch(`http://localhost:7000/history/${devId}`);
        if (!res.ok) throw new Error("Error fetching history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTxHistory();
  }, [devId]);

  if (loading) return <p className="p-4">Loading transaction history...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;return (
    <div className={`min-h-screen bg-dexora p-10 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
      <div className="max-w-3xl mx-auto bg-[#111111] border border-gray-800 shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-indigo-500 mb-6">Transaction History</h1>

        {history.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-left text-sm border border-gray-800 text-white">
            <thead>
              <tr className="bg-[#1a1a1a] text-gray-400">
                <th className="p-2">Status</th>
                <th className="p-2">Tx Hash</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="p-2">{tx.status}</td>
                  <td className="p-2">
                    {tx.tx_hash ? (
                      <a
                        href={`https://explorer.yourchain.io/tx/${tx.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        {tx.tx_hash.slice(0, 10)}...
                      </a>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                  <td className="p-2">{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TxHistory;
