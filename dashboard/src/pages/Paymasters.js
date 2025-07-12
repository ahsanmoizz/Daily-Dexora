import React, { useEffect, useState } from "react";
import { useSidebar } from "../components/SidebarContext";

function Paymasters() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [paymasters, setPaymasters] = useState([]);
  const [name, setName] = useState("");
 const { collapsed } = useSidebar();

  const devId = localStorage.getItem("dev_id");

  const fetchProjects = async () => {
    const res = await fetch(`http://localhost:6000/projects/${devId}`);
    const data = await res.json();
    setProjects(data);
    if (data[0]) setSelectedProject(data[0].id);
  };

  const fetchPaymasters = async () => {
    if (!selectedProject) return;
    const res = await fetch(`http://localhost:6000/paymasters/${selectedProject}`);
    const data = await res.json();
    setPaymasters(data);
  };

  const addPaymaster = async () => {
    const res = await fetch(`http://localhost:6000/paymasters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projectId: selectedProject,
        devId,
      }),
    });
    const newPM = await res.json();
    setPaymasters([...paymasters, newPM]);
    setName("");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchPaymasters();
  }, [selectedProject]);
return (
    <div className={`min-h-screen bg-dexora p-10 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
      <h2 className="text-3xl font-bold text-indigo-500 mb-6">Your Paymasters</h2>

      <select
        className="bg-[#1a1a1a] text-white border border-gray-700 p-2 mb-4 rounded"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <div className="mb-6">
        <input
          placeholder="Paymaster name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 px-4 py-2 mr-2 rounded"
        />
        <button
          onClick={addPaymaster}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
        >
          + Add Paymaster
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymasters.map((pm) => (
          <div key={pm.id} className="bg-[#111111] border border-gray-800 shadow rounded-xl p-6">
            <h3 className="font-bold text-lg text-white">{pm.name}</h3>
            <p className="text-sm text-gray-400">Project: {pm.projectId}</p>
            <p className="text-xs text-gray-500 mt-1">PM ID: {pm.id}</p>
            <p className="text-sm mt-2 text-gray-400">Credits: {pm.credits || 5000}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Paymasters;
