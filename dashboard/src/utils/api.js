const API_BASE = "http://localhost:5001"; // Auth service

export async function fetchAccount(id) {
  const res = await fetch(`${API_BASE}/account/${id}`);
  if (!res.ok) throw new Error("Account not found");
  return await res.json();
}
