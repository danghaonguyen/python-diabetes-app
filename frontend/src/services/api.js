import api from "./apiClient";

export async function predictDiabetes(data) {
  try {
    const response = await api.post("/predict", data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi gọi API:", error);
    return {
      risk_level: "Không xác định",
      probability: 0,
    };
  }
}