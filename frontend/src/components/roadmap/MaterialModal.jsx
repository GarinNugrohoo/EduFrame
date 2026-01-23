import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpenIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  VideoIcon,
  FileTextIcon,
  XIcon,
} from "../icons/IkonWrapper";
import roadmapsDetail from "../../api/roadmapsDetail";

const MaterialModal = ({
  isOpen,
  onClose,
  material,
  onProgressUpdate,
  getTotalTimeSpent,
  startTrackingTime,
  stopTrackingTime,
  userId,
}) => {
  const safeMaterial = useMemo(
    () =>
      material || {
        id: "",
        title: "Materi",
        description: "Deskripsi materi",
        type: "video",
        duration: "0 menit",
        progress: "not_started",
        youtubeUrl: "",
        resources: [],
      },
    [material],
  );

  const [selectedProgress, setSelectedProgress] = useState(
    safeMaterial.progress || "not_started",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(() => {
    if (material?.id) {
      return getTotalTimeSpent(material.id);
    }
    return 0;
  });

  const progressOptions = [
    {
      value: "not_started",
      label: "Belum Mulai",
      icon: BookOpenIcon,
      color: "red",
    },
    {
      value: "in_progress",
      label: "Sedang Dipelajari",
      icon: PlayCircleIcon,
      color: "yellow",
    },
    {
      value: "completed",
      label: "Selesai",
      icon: CheckCircleIcon,
      color: "green",
    },
  ];

  useEffect(() => {
    let interval;
    if (isOpen && safeMaterial.id && selectedProgress === "in_progress") {
      interval = setInterval(() => {
        const currentTime = getTotalTimeSpent(safeMaterial.id);
        setTimeSpentMinutes(currentTime);
      }, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, safeMaterial.id, selectedProgress, getTotalTimeSpent]);

  useEffect(() => {
    if (isOpen && safeMaterial) {
      setSelectedProgress(safeMaterial.progress || "not_started");
    }
  }, [isOpen, safeMaterial]);

  const handleProgressChange = async (progress) => {
    const oldProgress = selectedProgress;

    if (oldProgress === "not_started" && progress === "completed") {
      startTrackingTime(safeMaterial.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      stopTrackingTime(safeMaterial.id);
      setSelectedProgress("in_progress");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setSelectedProgress(progress);

    if (oldProgress === "in_progress" && progress !== "in_progress") {
      stopTrackingTime(safeMaterial.id);
    }

    if (progress === "in_progress" && oldProgress !== "in_progress") {
      startTrackingTime(safeMaterial.id);
    }

    const currentTime = getTotalTimeSpent(safeMaterial.id);
    setTimeSpentMinutes(currentTime);
  };

  const saveProgressToLocal = (materialId, newStatus) => {
    const progressKey = `progress_${materialId}_${userId}`;
    const existingProgress = localStorage.getItem(progressKey);
    let progressData = {
      progress_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (existingProgress) {
      try {
        const existing = JSON.parse(existingProgress);
        progressData.time_spent_minutes = existing.time_spent_minutes || 0;
      } catch (e) {}
    }

    if (newStatus === "completed") {
      progressData.completed_at = new Date().toISOString();
    }

    if (newStatus === "not_started") {
      progressData.time_spent_minutes = 0;
      progressData.completed_at = null;
    }

    localStorage.setItem(progressKey, JSON.stringify(progressData));
  };

  const updateProgressToServer = async (materialId, newStatus) => {
    try {
      let result;
      switch (newStatus) {
        case "completed":
          const totalTimeSpent = getTotalTimeSpent(materialId);
          result = await roadmapsDetail.completeMaterial(
            materialId,
            userId,
            totalTimeSpent,
          );
          break;
        case "in_progress":
          result = await roadmapsDetail.startMaterial(materialId, userId);
          break;
        case "not_started":
          result = await roadmapsDetail.resetMaterialProgress(
            materialId,
            userId,
          );
          break;
        default:
          result = await roadmapsDetail.updateUserProgress(materialId, userId, {
            progress_status: newStatus,
          });
      }
      return result;
    } catch (error) {
      return { success: true, message: "Disimpan secara lokal" };
    }
  };

  const handleSave = async () => {
    if (!safeMaterial.id || selectedProgress === safeMaterial.progress) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      if (safeMaterial.id) {
        stopTrackingTime(safeMaterial.id);
      }

      saveProgressToLocal(safeMaterial.id, selectedProgress);
      await updateProgressToServer(safeMaterial.id, selectedProgress);
      onProgressUpdate(safeMaterial.id, selectedProgress);
    } catch (error) {
      alert("Gagal menyimpan progress. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleWatchClick = () => {
    if (safeMaterial.youtubeUrl) {
      if (safeMaterial.id && selectedProgress !== "completed") {
        startTrackingTime(safeMaterial.id);
        setSelectedProgress("in_progress");
      }
      window.open(safeMaterial.youtubeUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadResource = (resource) => {
    if (resource.file_url) window.open(resource.file_url, "_blank");
  };

  if (!isOpen) return null;

  const currentProgress = safeMaterial.progress || "not_started";
  const hasChanged = selectedProgress !== currentProgress;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="flex min-h-full items-end justify-center p-0 md:items-center md:p-4">
        <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-hidden rounded-t-2xl md:rounded-2xl shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center">
                  {safeMaterial.type === "video" ? (
                    <VideoIcon className="w-5 h-5 text-red-600" />
                  ) : (
                    <FileTextIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900 line-clamp-1">
                    {safeMaterial.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {safeMaterial.description}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Status Pembelajaran
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {progressOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedProgress === option.value;
                  const isCurrent = currentProgress === option.value;
                  const borderClass = isSelected
                    ? option.value === "not_started"
                      ? "border-red-500 bg-red-50"
                      : option.value === "in_progress"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300";
                  const bgClass = isSelected
                    ? option.value === "not_started"
                      ? "bg-red-500 text-white"
                      : option.value === "in_progress"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400";

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleProgressChange(option.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative ${borderClass} ${
                        isCurrent ? "ring-2 ring-offset-1 ring-blue-400" : ""
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${bgClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {hasChanged && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Klik "Simpan Status" untuk mengubah
                </p>
              )}

              {(selectedProgress === "in_progress" ||
                selectedProgress === "completed") &&
                timeSpentMinutes > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">
                          Waktu yang sudah dihabiskan:
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-700">
                        {timeSpentMinutes} menit
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Waktu dihitung otomatis saat Anda membuka materi ini
                    </p>
                  </div>
                )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Informasi Materi
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">
                      Durasi Materi
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {safeMaterial.duration}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    {safeMaterial.type === "video" ? (
                      <VideoIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <FileTextIcon className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-xs font-medium text-gray-700">
                      Tipe
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {safeMaterial.type}
                  </p>
                </div>
              </div>
            </div>

            {safeMaterial.resourceData &&
              safeMaterial.resourceData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Materi Pendukung
                  </h3>
                  <div className="space-y-2">
                    {safeMaterial.resourceData.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleDownloadResource(resource)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <FileTextIcon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="text-left">
                            <span className="text-sm text-gray-900 block">
                              {resource.title}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              {resource.resource_type} •{" "}
                              {resource.file_size
                                ? `${(resource.file_size / 1024).toFixed(1)} KB`
                                : "Unknown size"}
                            </span>
                          </div>
                        </div>
                        <button
                          className="text-xs text-red-600 font-medium px-3 py-1 hover:bg-red-50 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResource(resource);
                          }}
                        >
                          Unduh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {safeMaterial.youtubeUrl && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Video Pembelajaran
                </h3>
                <div
                  className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black cursor-pointer active:scale-95 transition-transform"
                  onClick={handleWatchClick}
                >
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <PlayCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white font-medium">
                        Tonton di YouTube
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        Klik untuk membuka
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Waktu menonton akan dihitung otomatis
                </p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanged}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  !hasChanged || isSaving
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800"
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Status"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
