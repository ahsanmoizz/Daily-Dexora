import React, { useState, useEffect } from "react";
import { useSidebar } from "../components/SidebarContext";
function Projects() {
  
  const { collapsed } = useSidebar(); // ✅ FIXED: using the context
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const devId = localStorage.getItem("dev_id");

  const fetchProjects = async () => {
    const res = await fetch(`http://localhost:6000/projects/${devId}`);
    const data = await res.json();
    setProjects(data);
  };

  const addProject = async () => {
    if (!projectName) return;
    const res = await fetch(`http://localhost:6000/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName, devId }),
    });
    const newProject = await res.json();
    setProjects([...projects, newProject]);
    setProjectName("");
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div
      className={`bg-dexora min-h-screen p-10 transition-all duration-300 ${
        collapsed ? "ml-16" : "ml-64"
      }`}
    >
      <h2 className="text-3xl font-bold text-indigo-200 mb-6">Your Projects</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-gray-700 px-4 py-2 mr-3 rounded"
        />
        <button
          onClick={addProject}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
        >
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-[#111111] border border-gray-800 p-6 rounded-xl shadow"
          >
            <h3 className="text-lg font-bold text-white">{p.name}</h3>
            <p className="text-sm text-gray-400 mt-2">
              Credits: {p.credits || 100000}
            </p>
            <p className="text-xs text-gray-500 mt-1">Project ID: {p.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;