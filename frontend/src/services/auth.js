import api from "./apiClient";

// Mọi request đi qua instance `api` (apiClient.js): baseURL = /api (proxy Vite),
// withCredentials = true để gửi kèm cookie session của Flask.

export async function registerUser(data) {
  return api.post("/register", {
    username: data.username,
    email: data.email,
    password: data.password,
    code: data.code,
  });
}

export async function loginUser(data) {
  return api.post("/login", {
    email: data.email,
    password: data.password,
  });
}

export async function sendVerificationCode(data) {
  return api.post("/send_verification_code", {
    email: data.email,
  });
}

export async function sendPasswordResetEmail(data) {
  return api.post("/send_password_reset", {
    email: data.email,
  });
}

export async function verifyResetCode(data) {
  return api.post("/verify_reset_code", {
    email: data.email,
    code: data.code,
  });
}

export async function resetPassword(data) {
  return api.post("/reset_password", {
    email: data.email,
    code: data.code,
    new_password: data.new_password,
  });
}

export async function logoutUser() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  await api.post("/logout");
}

export function getUserId() {
  return localStorage.getItem("user_id");
}
