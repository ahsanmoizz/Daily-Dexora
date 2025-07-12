import React, { useEffect, useState } from "react";

import { useSidebar } from "../components/SidebarContext";
function Bundlers() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [bundlers, setBundlers] = useState([]);
  const [url, setUrl] = useState("");
const { collapsed } = useSidebar();
  const devId = localStorage.getItem("dev_id");

  const fetchProjects = async () => {
    const res = await fetch(`http://localhost:6000/projects/${devId}`);
    const data = await res.json();
    setProjects(data);
    if (data[0]) setSelectedProject(data[0].id);
  };

  const fetchBundlers = async () => {
    if (!selectedProject) return;
    const res = await fetch(`http://localhost:6000/bundlers/${selectedProject}`);
    const data = await res.json();
    setBundlers(data);
  };

  const addBundler = async () => {
    const res = await fetch(`http://localhost:6000/bundlers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        projectId: selectedProject,
        devId,
      }),
    });
    const newBundler = await res.json();
    setBundlers([...bundlers, newBundler]);
    setUrl("");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchBundlers();
  }, [selectedProject]);
 return (
    <div className={`min-h-screen bg-dexora p-10 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
      <h2 className="text-3xl font-bold text-indigo-500 mb-6">Your Bundlers</h2>

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
          placeholder="Bundler URL (http...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 px-4 py-2 mr-2 rounded"
        />
        <button
          onClick={addBundler}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
        >
          + Add Bundler
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bundlers.map((b) => (
          <div key={b.id} className="bg-[#111111] border border-gray-800 shadow rounded-xl p-6">
            <h3 className="font-bold text-lg text-white">{b.url}</h3>
            <p className="text-sm text-gray-400">Project: {b.projectId}</p>
            <p className="text-xs text-gray-500 mt-1">Bundler ID: {b.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bundlers;
