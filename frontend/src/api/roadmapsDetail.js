import axios from "axios";
import { API_URL, API_KEY } from "../constants/api";

const createApiClient = () => {
  const token = getToken();

  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
    timeout: 10000,
  });
};

const getUserId = () => {
  let userId = localStorage.getItem("id");

  if (!userId) {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id || user.user_id || user.userId;
      } catch (e) {}
    }
  }

  if (!userId) {
    userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
  }

  return userId;
};

const getToken = () => {
  let token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  if (!token) {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        token = user.token || user.accessToken || user.access_token;
      } catch (e) {}
    }
  }

  return token;
};

export const getCompleteRoadmap = async (roadmapId) => {
  try {
    const apiClient = createApiClient();
    const userId = getUserId();
    const url = `/roadmaps/${roadmapId}/complete?user_id=${userId}`;

    const response = await apiClient.get(url);

    if (response.data?.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Berhasil mengambil roadmap lengkap",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Format respons tidak valid",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengambil data roadmap",
      data: null,
    };
  }
};

export const updateUserProgress = async (materialId, progressData) => {
  try {
    const apiClient = createApiClient();
    const userId = getUserId();

    const response = await apiClient.post(
      `/roadmaps/materials/${materialId}/progress`,
      {
        ...progressData,
        user_id: userId,
      },
    );

    const progressKey = `progress_${materialId}_${userId}`;
    localStorage.setItem(
      progressKey,
      JSON.stringify({
        ...progressData,
        user_id: userId,
        updated_at: new Date().toISOString(),
      }),
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Progress berhasil disimpan",
    };
  } catch (error) {
    const userId = getUserId();
    const progressKey = `progress_${materialId}_${userId}`;

    localStorage.setItem(
      progressKey,
      JSON.stringify({
        ...progressData,
        user_id: userId,
        updated_at: new Date().toISOString(),
      }),
    );

    return {
      success: true,
      message: "Disimpan ke lokal",
      data: {
        material_id: materialId,
        user_id: userId,
        ...progressData,
      },
    };
  }
};

export const calculateRoadmapProgress = (semesters) => {
  const userId = getUserId();
  let totalMaterials = 0;
  let completedMaterials = 0;
  let inProgressMaterials = 0;
  let totalTimeSpent = 0;

  semesters?.forEach((semester) => {
    semester.materials?.forEach((material) => {
      totalMaterials++;

      let progress = "not_started";
      let timeSpent = 0;
      const progressKey = `progress_${material.id}_${userId}`;
      const localProgress = localStorage.getItem(progressKey);

      if (localProgress) {
        try {
          const parsed = JSON.parse(localProgress);
          progress = parsed.progress_status || "not_started";
          timeSpent = parsed.time_spent_minutes || 0;
        } catch (e) {
          progress = localProgress;
        }
      } else if (material.user_progress) {
        progress = material.user_progress.progress_status || "not_started";
        timeSpent = material.user_progress.time_spent_minutes || 0;
      }

      if (progress === "completed") {
        completedMaterials++;
        totalTimeSpent += timeSpent;
      } else if (progress === "in_progress") {
        inProgressMaterials++;
      }
    });
  });

  const percentage =
    totalMaterials > 0
      ? Math.round((completedMaterials / totalMaterials) * 100)
      : 0;

  return {
    total_materials: totalMaterials,
    completed_materials: completedMaterials,
    in_progress_materials: inProgressMaterials,
    not_started_materials:
      totalMaterials - completedMaterials - inProgressMaterials,
    percentage: percentage,
    total_time_spent: totalTimeSpent,
  };
};

export const startMaterial = async (materialId) => {
  try {
    const userId = getUserId();
    const result = await updateUserProgress(materialId, {
      progress_status: "in_progress",
      time_spent_minutes: 0,
    });

    return {
      ...result,
      message: "Material berhasil dimulai",
    };
  } catch (error) {
    const userId = getUserId();
    const progressKey = `progress_${materialId}_${userId}`;

    localStorage.setItem(
      progressKey,
      JSON.stringify({
        progress_status: "in_progress",
        time_spent_minutes: 0,
        user_id: userId,
        updated_at: new Date().toISOString(),
      }),
    );

    return {
      success: true,
      message: "Material dimulai (disimpan lokal)",
      data: {
        material_id: materialId,
        user_id: userId,
        progress_status: "in_progress",
      },
    };
  }
};

export const completeMaterial = async (materialId, timeSpentMinutes = 0) => {
  try {
    const apiClient = createApiClient();
    const userId = getUserId();

    const response = await apiClient.post(
      `/roadmaps/materials/${materialId}/complete`,
      {
        user_id: userId,
      },
    );

    if (response.data?.success) {
      const backendTime = response.data.data?.time_spent_minutes || 0;
      const progressKey = `progress_${materialId}_${userId}`;

      const progressData = {
        progress_status: "completed",
        completed_at: new Date().toISOString(),
        time_spent_minutes: backendTime,
        updated_at: new Date().toISOString(),
        user_id: userId,
      };

      localStorage.setItem(progressKey, JSON.stringify(progressData));
    }

    return {
      success: true,
      data: response.data?.data,
      message: response.data?.message || "Material berhasil diselesaikan",
    };
  } catch (error) {
    const userId = getUserId();
    const progressKey = `progress_${materialId}_${userId}`;

    const fallbackData = {
      progress_status: "completed",
      time_spent_minutes: timeSpentMinutes,
      completed_at: new Date().toISOString(),
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(progressKey, JSON.stringify(fallbackData));

    return {
      success: true,
      message: "Material diselesaikan (disimpan lokal)",
      data: {
        material_id: materialId,
        user_id: userId,
        progress_status: "completed",
        time_spent_minutes: timeSpentMinutes,
      },
    };
  }
};

export const resetMaterialProgress = async (materialId) => {
  try {
    const apiClient = createApiClient();
    const userId = getUserId();

    await apiClient.post(`/roadmaps/materials/${materialId}/progress`, {
      progress_status: "not_started",
      time_spent_minutes: 0,
      started_at: null,
      completed_at: null,
      notes: null,
      user_id: userId,
      full_reset: true,
    });

    const progressKey = `progress_${materialId}_${userId}`;
    localStorage.removeItem(progressKey);

    return {
      success: true,
      message: "Progress berhasil direset sepenuhnya",
    };
  } catch (error) {
    const userId = getUserId();
    const progressKey = `progress_${materialId}_${userId}`;
    localStorage.removeItem(progressKey);

    return {
      success: true,
      message: "Progress direset (disimpan lokal)",
      data: {
        material_id: materialId,
        user_id: userId,
        progress_status: "not_started",
      },
    };
  }
};

const roadmapsDetail = {
  getCompleteRoadmap,
  updateUserProgress,
  calculateRoadmapProgress,
  startMaterial,
  completeMaterial,
  resetMaterialProgress,
};

export default roadmapsDetail;
