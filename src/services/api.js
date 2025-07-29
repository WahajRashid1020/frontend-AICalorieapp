import axios from "axios";

const API_URL = "https://backend-calorieapp-1.onrender.com/api/calories";

export const fetchCalories = async (ingredients) => {
  try {
    const response = await axios.post(API_URL, { ingredients });
    return response.data;
  } catch (error) {
    // You can throw the error up or format it here
    throw error.response?.data || error;
  }
};
