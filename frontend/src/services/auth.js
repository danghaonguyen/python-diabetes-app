import axios from "axios";

const API_BASE = "http://127.0.0.1:5000/api";

export async function registerUser(data) {
  return axios.post(`${API_BASE}/register`, {
    username: data.username,
    email: data.email,
    password: data.password,
    code: data.code,
  }, {
    withCredentials: true
  });
}

export async function loginUser(data) {
  return axios.post(`${API_BASE}/login`, {
    email: data.email,
    password: data.password,
  });
}

export async function sendVerificationCode(data) {
  return axios.post(`${API_BASE}/send_verification_code`, {
    email: data.email,
  });
}

export async function sendPasswordResetEmail(data) {
  return axios.post(`${API_BASE}/send_password_reset`, {
    email: data.email,
  });
}

export async function verifyResetCode(data) {
  return axios.post(`${API_BASE}/verify_reset_code`, {
    email: data.email,
    code: data.code,
  });
}

export async function resetPassword(data) {
  return axios.post(`${API_BASE}/reset_password`, {
    email: data.email,
    code: data.code,
    new_password: data.new_password,
  });
}

export function logoutUser() {
  localStorage.removeItem("user_id");
}

export function getUserId() {
  return localStorage.getItem("user_id");
}