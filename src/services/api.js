import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api/calories"
    : "https://backend-calorieapp-1.onrender.com/api/calories";

export const fetchCalories = async (ingredients) => {
  try {
    const response = await axios.post(API_URL, { ingredients });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
