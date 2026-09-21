import api from "./apiClient";

export async function predictDiabetes(data) {
  const response = await api.post("/predict", data);
  return response.data;
}
