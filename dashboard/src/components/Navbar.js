import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext"; // adjust path
import {
  FaProjectDiagram,
  FaMoneyCheckAlt,
  FaServer,
  FaPaperPlane,
  FaHistory,
  FaRocket,
  FaUserCog,
  FaSignOutAlt,
  FaEthereum,
  FaBars,
} from "react-icons/fa";

const navItems = [
  { to: "/projects", icon: <FaProjectDiagram />, label: "Projects" },
  { to: "/paymasters", icon: <FaMoneyCheckAlt />, label: "Paymasters" },
  { to: "/bundlers", icon: <FaServer />, label: "Bundlers" },
  { to: "/send", icon: <FaPaperPlane />, label: "Send Tx" },
  { to: "/tx-history", icon: <FaHistory />, label: "Tx History" },
  { to: "/upgrade", icon: <FaRocket />, label: "Upgrade" },
  { to: "/account", icon: <FaUserCog />, label: "Account" },
];

function Navbar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
      <aside
      className={`h-screen fixed top-0 left-0 bg-[#0d0d0d] text-white transition-all duration-300 shadow-lg ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FaEthereum className="text-indigo-400" />
          {!collapsed && (
            <span className="font-bold text-indigo-400">Daily Network</span>
          )}
        </div>
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-4 mt-8 px-2 text-sm">
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-800 transition"
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 w-full px-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-2 text-sm w-full hover:bg-slate-800 text-red-400 rounded transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
