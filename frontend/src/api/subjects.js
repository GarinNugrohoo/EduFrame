import axios from "axios";
import { API_URL, API_KEY } from "../constants/api";

const config = {
  headers: {
    apikey: API_KEY,
  },
};

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/materi`, config);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.warn("API respon format:", response.data);
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getSubjectsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/materi/${id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
