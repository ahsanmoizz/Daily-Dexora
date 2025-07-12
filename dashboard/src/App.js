import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'; 
import Projects from "./pages/projects";
import Paymasters from "./pages/Paymasters";
import Bundlers from "./pages/Bundlers";
import Wallet from "./pages/Wallet";
import SendTx from "./pages/SendTx";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Account from "./pages/Account";
import TxHistory from "./pages/TxHistory";
import UpgradePlan from "./pages/UpgradePlan";

// Check login state
const isLoggedIn = !!localStorage.getItem("api_key");

function App() {
  return (
    
    <Router>
      <div className="flex min-h-screen bg-slate-900 text-white">
        {isLoggedIn && <Navbar />}
        <main className={isLoggedIn ? "ml-64 flex-1 p-6" : "w-full p-6"}>
          <Routes>
          
            {/* ✅ Root path redirect */}
            <Route path="/" element={<Navigate to={isLoggedIn ? "/account" : "/login"} />} />

            {/* ✅ Auth + Dashboard Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/paymasters" element={<Paymasters />} />
            <Route path="/bundlers" element={<Bundlers />} />
            <Route path="/upgrade" element={<UpgradePlan />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/send" element={<SendTx />} />
            <Route path="/tx-history" element={<TxHistory />} />

            {/* ✅ Fallback for unknown URLs */}
            <Route path="*" element={<Navigate to="/" />} />
          
          </Routes>
        </main>
      </div>
    </Router>
   
  );
}

export default App;
