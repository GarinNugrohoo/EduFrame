import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roadmapsDetail from "../api/roadmapsDetail";
import RoadmapHeader from "../components/roadmap/RoadmapHeader";
import ProgressStats from "../components/roadmap/ProgressStats";
import SemesterList from "../components/roadmap/SemesterList";
import LearningTips from "../components/roadmap/LearningTips";
import UserStats from "../components/roadmap/UserStats";
import MaterialModal from "../components/roadmap/MaterialModal";
import LoadingState from "../components/roadmap/LoadingState";
import ErrorState from "../components/roadmap/ErrorState";
import { useTimeTracking } from "../hooks/useTimeTracking";

const RoadMap = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSemesters, setOpenSemesters] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const userId = React.useMemo(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return user.id ? user.id.toString() : null;
      } catch (e) {
        return null;
      }
    }
    return localStorage.getItem("id");
  }, []);

  const {
    startTrackingTime,
    stopTrackingTime,
    getTotalTimeSpent,
    resetTimeTracking,
    cleanupAllTimers,
  } = useTimeTracking(userId);

  const loadOpenSemestersFromStorage = useCallback(
    (semesters) => {
      if (!semesters || semesters.length === 0) return {};

      const storageKey = `roadmap_${subjectId}_open_semesters_${userId}`;
      const savedState = localStorage.getItem(storageKey);

      let initialState = {};

      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          semesters.forEach((semester) => {
            if (parsed[semester.id] !== undefined) {
              initialState[semester.id] = parsed[semester.id];
            } else {
              initialState[semester.id] = false;
            }
          });
        } catch (e) {
          semesters.forEach((semester) => {
            initialState[semester.id] = false;
          });
        }
      } else {
        semesters.forEach((semester) => {
          initialState[semester.id] = false;
        });
      }

      return initialState;
    },
    [subjectId, userId],
  );

  const saveOpenSemestersToStorage = useCallback(
    (openState) => {
      const storageKey = `roadmap_${subjectId}_open_semesters_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(openState));
    },
    [subjectId, userId],
  );

  const transformMaterialData = useCallback(
    (material, userId) => {
      let progressStatus = "not_started";
      let timeSpentMinutes = 0;

      if (material.user_progress) {
        if (material.user_progress.progress_status) {
          progressStatus = material.user_progress.progress_status;
        }

        if (material.user_progress.time_spent_minutes) {
          const serverTime = parseInt(
            material.user_progress.time_spent_minutes,
          );
          if (!isNaN(serverTime) && serverTime > 0) {
            if (!(serverTime === 6 && material.id.toString() === "1")) {
              timeSpentMinutes = serverTime;
            }
          }
        }
      }

      if (userId && timeSpentMinutes === 0) {
        const localStorageKey = `progress_${material.id}_${userId}`;
        const localProgress = localStorage.getItem(localStorageKey);

        if (localProgress) {
          try {
            const parsed = JSON.parse(localProgress);
            let localMinutes = 0;

            if (parsed.version === "2.0" && parsed.total_seconds) {
              localMinutes = Math.floor(parsed.total_seconds / 60);
            } else if (parsed.time_spent_minutes) {
              localMinutes = parseInt(parsed.time_spent_minutes) || 0;
            }

            if (localMinutes > 0) {
              if (!(localMinutes === 6 && material.id.toString() === "1")) {
                timeSpentMinutes = localMinutes;
              }
            }

            if (progressStatus === "not_started" && parsed.progress_status) {
              progressStatus = parsed.progress_status;
            }
          } catch (e) {
            throw e;
          }
        }
      }

      if (timeSpentMinutes === 0 && userId) {
        const realTimeMinutes = getTotalTimeSpent(material.id.toString());
        if (realTimeMinutes > 0) {
          timeSpentMinutes = realTimeMinutes;
        }
      }

      return {
        id: material.id.toString(),
        title: material.title || "Materi",
        description: material.description || "Deskripsi materi",
        type: material.content_type || "video",
        duration: material.duration_minutes
          ? `${material.duration_minutes} menit`
          : "0 menit",
        youtubeUrl: material.youtube_url || "",
        progress: progressStatus,
        timeSpentMinutes,
        resources: material.resources?.map((r) => r.title) || [],
        resourceData: material.resources || [],
        originalData: material,
      };
    },
    [userId, getTotalTimeSpent, resetTimeTracking],
  );

  const transformRoadmapData = useCallback(
    (roadmap) => {
      if (!roadmap) {
        return { openSemesters: {}, roadmapData: null };
      }

      const transformedSemesters =
        roadmap.semesters?.map((semester, index) => {
          const materials =
            semester.materials?.map((material) => {
              return transformMaterialData(material, userId);
            }) || [];

          return {
            id: semester.id?.toString() || `sem-${index}`,
            title: semester.title || `Semester ${semester.semester_number}`,
            semester_number: semester.semester_number || index + 1,
            materials: materials,
            material_count: semester.material_count || materials.length,
          };
        }) || [];

      let totalMaterials = 0;
      let completedMaterials = 0;
      let inProgressMaterials = 0;
      let notStartedMaterials = 0;
      let totalTimeSpent = 0;

      transformedSemesters.forEach((semester) => {
        semester.materials.forEach((material) => {
          totalMaterials++;
          totalTimeSpent += material.timeSpentMinutes;

          switch (material.progress) {
            case "completed":
              completedMaterials++;
              break;
            case "in_progress":
              inProgressMaterials++;
              break;
            default:
              notStartedMaterials++;
          }
        });
      });

      const percentage =
        totalMaterials > 0
          ? Math.round((completedMaterials / totalMaterials) * 100)
          : 0;

      const savedOpenState = loadOpenSemestersFromStorage(transformedSemesters);

      return {
        openSemesters: savedOpenState,
        roadmapData: {
          id: roadmap.id?.toString() || "unknown",
          name: roadmap.subject_name || roadmap.title || "Roadmap",
          code: roadmap.subject_code || "SUB",
          description: roadmap.description || "Deskripsi roadmap",
          grade_level: roadmap.grade_level || "10",
          semester: roadmap.subject_semester || "ganjil & genap",
          color: roadmap.color || "#4CAF50",
          semesters: transformedSemesters,
          progress: {
            completed: completedMaterials,
            total: totalMaterials,
            percentage,
            in_progress: inProgressMaterials,
            not_started: notStartedMaterials,
            total_time_spent: totalTimeSpent,
          },
          total_hours: roadmap.total_hours || 0,
          is_active: roadmap.is_active !== undefined ? roadmap.is_active : true,
          created_at: roadmap.created_at,
          updated_at: roadmap.updated_at,
          user_stats: roadmap.user_stats || {
            last_accessed: new Date().toISOString(),
            total_time_spent: totalTimeSpent,
          },
        },
      };
    },
    [transformMaterialData, userId, loadOpenSemestersFromStorage],
  );

  const fetchRoadmapData = useCallback(async () => {
    if (!subjectId) {
      setErrorMessage("ID mata pelajaran tidak valid");
      setLoading(false);
      return;
    }

    if (!userId) {
      setErrorMessage("User tidak terautentikasi. Silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await roadmapsDetail.getCompleteRoadmap(
        subjectId,
        userId,
      );

      if (response?.success && response.data) {
        const transformedData = transformRoadmapData(response.data);
        setOpenSemesters(transformedData.openSemesters);
        setRoadmapData(transformedData.roadmapData);
      } else {
        setRoadmapData(null);
        setErrorMessage(response?.message || "Roadmap tidak ditemukan");
      }
    } catch (error) {
      setRoadmapData(null);
      setErrorMessage("Gagal memuat roadmap. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [subjectId, userId, transformRoadmapData]);

  useEffect(() => {
    fetchRoadmapData();
    return () => {
      cleanupAllTimers();
    };
  }, [fetchRoadmapData, cleanupAllTimers]);

  const handleMaterialClick = useCallback((material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  }, []);

  const handleProgressUpdate = useCallback(
    async (materialId, newProgress) => {
      if (!materialId || !userId) return;

      try {
        switch (newProgress) {
          case "completed":
            const minutesSpent =
              stopTrackingTime(materialId) || getTotalTimeSpent(materialId);
            await roadmapsDetail.completeMaterial(
              materialId,
              userId,
              minutesSpent,
            );
            break;

          case "in_progress":
            await roadmapsDetail.resetMaterialProgress(materialId, userId);
            await new Promise((resolve) => setTimeout(resolve, 100));
            startTrackingTime(materialId);
            await roadmapsDetail.startMaterial(materialId, userId);
            break;

          case "not_started":
            await roadmapsDetail.resetMaterialProgress(materialId, userId);
            resetTimeTracking(materialId, true);
            break;

          default:
            await roadmapsDetail.updateUserProgress(materialId, userId, {
              progress_status: newProgress,
            });
        }

        fetchRoadmapData();
      } catch (error) {
        alert("Gagal menyimpan progress. Silakan coba lagi.");
      }
    },
    [
      userId,
      startTrackingTime,
      stopTrackingTime,
      getTotalTimeSpent,
      resetTimeTracking,
      fetchRoadmapData,
    ],
  );

  const handleToggleSemester = useCallback(
    (semesterId) => {
      setOpenSemesters((prev) => {
        const newState = { ...prev, [semesterId]: !prev[semesterId] };
        saveOpenSemestersToStorage(newState);
        return newState;
      });
    },
    [saveOpenSemestersToStorage],
  );

  const handleToggleAllSemesters = useCallback(() => {
    if (!roadmapData) return;

    const allOpen = Object.values(openSemesters).every((v) => v);
    const newOpenState = {};

    roadmapData.semesters.forEach((semester) => {
      newOpenState[semester.id] = !allOpen;
    });

    saveOpenSemestersToStorage(newOpenState);
    setOpenSemesters(newOpenState);
  }, [openSemesters, roadmapData, saveOpenSemestersToStorage]);

  const handleBackToHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (!roadmapData || errorMessage) {
    return (
      <ErrorState
        message={
          errorMessage || "Roadmap untuk mata pelajaran ini belum tersedia."
        }
        onBack={handleBackToHome}
        onRetry={fetchRoadmapData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <RoadmapHeader
        roadmapData={roadmapData}
        onBack={handleBackToHome}
        onRefresh={fetchRoadmapData}
      />

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <p className="text-sm text-gray-700">{roadmapData.description}</p>
        </div>

        <ProgressStats
          progress={roadmapData.progress}
          color={roadmapData.color}
        />

        <SemesterList
          semesters={roadmapData.semesters}
          openSemesters={openSemesters}
          onMaterialClick={handleMaterialClick}
          onToggleSemester={handleToggleSemester}
          onToggleAll={handleToggleAllSemesters}
        />

        {roadmapData.user_stats && (
          <UserStats
            userStats={roadmapData.user_stats}
            totalTimeSpent={roadmapData.progress.total_time_spent}
          />
        )}

        <LearningTips />
      </div>

      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        material={selectedMaterial}
        onProgressUpdate={handleProgressUpdate}
        getTotalTimeSpent={getTotalTimeSpent}
        startTrackingTime={startTrackingTime}
        stopTrackingTime={stopTrackingTime}
        userId={userId}
      />
    </div>
  );
};

export default RoadMap;
