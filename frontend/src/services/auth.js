const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}

export async function register(username, email, password) {
  const res = await fetch(`${API_BASE}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
}
