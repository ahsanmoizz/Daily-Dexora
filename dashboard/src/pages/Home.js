import React from "react";
import useProtectRoute from "../utils/protectRoute";

function Home() {
  useProtectRoute();
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-indigo-400">Welcome to Daily Network's Bundler Dashboard</h1>
      <p className="mt-4 text-slate-300">Track your smart wallet, send gasless txs, and manage your operations.</p>
    </div>
  );
}

export default Home;
