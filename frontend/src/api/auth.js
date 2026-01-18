import axios from "axios";
import { API_URL, API_KEY } from "../constants/api";

const createApiClient = (options = {}) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
    },
    withCredentials:
      options.withCredentials !== undefined ? options.withCredentials : true,
    timeout: 10000,
  });
};

const auth = {
  register: async (userData) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.post("/users/daftar", userData);

      return {
        success: true,
        data: response.data,
        message: response.data.message || "Registrasi berhasil",
      };
    } catch (error) {
      let errorMessage = "Registrasi gagal. Silakan coba lagi.";

      if (error.response) {
        const { data, status } = error.response;

        if (status === 400) {
          errorMessage = data?.message || "Data tidak valid.";
        } else if (status === 401) {
          errorMessage = data?.message || "Autentikasi gagal.";
        } else if (status === 409) {
          errorMessage =
            data?.message || "Email atau username sudah terdaftar.";
        } else if (status === 500) {
          errorMessage = "Server sedang mengalami masalah.";
        } else {
          errorMessage = data?.message || `Terjadi kesalahan (${status})`;
        }
      } else if (error.request) {
        errorMessage = "Tidak dapat terhubung ke server.";
      }

      return {
        success: false,
        message: errorMessage,
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
    }
  },

  login: async (credentials) => {
    try {
      const apiClient = createApiClient({ withCredentials: true });
      const response = await apiClient.post("/users/login", credentials);

      if (
        response.data.message === "Akun berhasil login" ||
        response.status === 200
      ) {
        const userData = {
          id: response.data.data?.id || response.data.data?.user_id,
          username: response.data.data?.username,
          email: response.data.data?.email || credentials.email,
          ...response.data.data,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data.data?.token) {
          localStorage.setItem("token", response.data.data.token);
        }

        return {
          success: true,
          data: response.data,
          user: userData,
          message: "Login berhasil!",
        };
      }

      return {
        success: false,
        message: response.data.message || "Login gagal",
      };
    } catch (error) {
      let errorMessage = "Login gagal. Silakan coba lagi.";

      if (error.response) {
        const { data, status } = error.response;

        if (status === 401) {
          errorMessage = data?.message || "Email atau password salah.";
        } else if (status === 404) {
          errorMessage = data?.message || "Endpoint tidak ditemukan.";
        } else if (status === 500) {
          errorMessage = data?.message || "Server error.";
        } else if (status === 0) {
          errorMessage = "CORS Error atau jaringan terputus.";
        } else {
          errorMessage = data?.message || `Error ${status}`;
        }
      } else if (error.request) {
        errorMessage = "Tidak dapat terhubung ke server.";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  logout: async () => {
    try {
      const apiClient = createApiClient();
      await apiClient.post("/auth/logout");
    } catch (error) {
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/onboarding";
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },

  getUserById: async (id) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get(`/users/${id}`);

      if (response.data.message === "Data ditemukan") {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Gagal mengambil data user",
      };
    }
  },

  clearAuthData: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

export default auth;
