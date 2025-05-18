import { jwtDecode } from "jwt-decode";

export function getUserId() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.userId || null;
  } catch {
    return null;
  }
}
