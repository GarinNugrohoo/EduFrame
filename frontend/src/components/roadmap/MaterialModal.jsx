import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  XIcon,
  VideoIcon,
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  DownloadIcon,
} from "../icons/IkonWrapper";

export const MaterialModal = ({
  isOpen,
  onClose,
  material,
  onProgressUpdate,
  onWatchYoutube,
}) => {
  // State management dengan null checking
  const [selectedProgress, setSelectedProgress] = useState("not_started");
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset state ketika modal dibuka/ditutup atau material berubah
  useEffect(() => {
    if (isOpen && material && material.progress) {
      setSelectedProgress(material.progress);
    } else {
      setSelectedProgress("not_started");
    }
    setIsSaving(false);
    setIsClosing(false);
  }, [isOpen, material]);

  // Handle ESC key untuk close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  // Handle progress change dengan debounce
  const handleProgressChange = useCallback(
    (progress) => {
      if (selectedProgress === progress) return;
      setSelectedProgress(progress);
    },
    [selectedProgress]
  );

  // Handle save dengan loading state
  const handleSaveProgress = useCallback(async () => {
    if (!material || !material.id || selectedProgress === material.progress) {
      handleClose();
      return;
    }

    setIsSaving(true);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onProgressUpdate(material.id, selectedProgress);
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
      handleClose();
    }
  }, [material, selectedProgress, onProgressUpdate]);

  // Handle close dengan animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  // Handle watch YouTube
  const handleWatchClick = useCallback(() => {
    if (material && material.youtubeUrl) {
      onWatchYoutube(material.youtubeUrl);
    }
  }, [material, onWatchYoutube]);

  // Handle download resource
  const handleDownload = useCallback((resource) => {
    console.log("Downloading:", resource);
    // Implement download logic here
  }, []);

  // Early return jika modal tidak open atau material null
  if (!isOpen || !material) {
    return null;
  }

  // Progress options dengan icon mapping
  const progressOptions = [
    {
      value: "not_started",
      label: "Belum Mulai",
      icon: BookOpenIcon,
      color: "gray",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      activeBgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      value: "in_progress",
      label: "Sedang Dipelajari",
      icon: PlayCircleIcon,
      color: "yellow",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      activeBgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    {
      value: "completed",
      label: "Selesai",
      icon: CheckCircleIcon,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      activeBgColor: "bg-green-100",
      textColor: "text-green-700",
    },
  ];

  // Safely get current progress
  const currentProgress = material.progress || "not_started";
  const hasProgressChanged = selectedProgress !== currentProgress;

  // Animation classes
  const modalAnimation = isClosing
    ? "animate-slide-out-bottom"
    : "animate-slide-in-bottom md:animate-fade-in";
  const backdropAnimation = isClosing ? "animate-fade-out" : "animate-fade-in";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 ${backdropAnimation}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-0 md:items-center md:p-4">
          <div
            className={`relative bg-white w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-2xl md:rounded-2xl shadow-2xl ${modalAnimation}`}
          >
            {/* Header - Mobile Optimized */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        material.type === "video"
                          ? "bg-gradient-to-br from-red-100 to-rose-200"
                          : "bg-gradient-to-br from-blue-100 to-blue-200"
                      }`}
                    >
                      {material.type === "video" ? (
                        <VideoIcon className="w-5 h-5 text-red-600" />
                      ) : (
                        <FileTextIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">
                      {material.title || "Materi"}
                    </h2>
                    <p className="text-xs text-gray-600 truncate mt-0.5">
                      {material.description || "Deskripsi materi"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors ml-2"
                  aria-label="Tutup"
                  disabled={isSaving}
                >
                  <XIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(92vh-180px)]">
              <div className="p-4 md:p-6">
                {/* Progress Section - Mobile Optimized */}
                <div className="mb-6">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                    Status Pembelajaran
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {progressOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedProgress === option.value;
                      const isCurrent = currentProgress === option.value;

                      return (
                        <button
                          key={option.value}
                          onClick={() => handleProgressChange(option.value)}
                          disabled={isSaving}
                          className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-lg border-2 transition-all duration-200 relative ${
                            isSelected
                              ? `${option.borderColor} ${option.bgColor}`
                              : "border-gray-200 hover:border-gray-300"
                          } ${
                            isSaving
                              ? "opacity-50 cursor-not-allowed"
                              : "active:scale-95"
                          }`}
                        >
                          {isCurrent && !isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                          <div
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-1.5 ${
                              isSelected
                                ? `${option.activeBgColor} ${option.textColor}`
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isSelected ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {hasProgressChanged && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Klik "Simpan Status" untuk mengubah
                    </p>
                  )}
                </div>

                {/* Material Info - Mobile Optimized */}
                <div className="mb-6">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                    Informasi Materi
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">
                          Durasi
                        </span>
                      </div>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {material.duration || "0 menit"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {material.type === "video" ? (
                          <VideoIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <FileTextIcon className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          Tipe
                        </span>
                      </div>
                      <p className="text-sm md:text-base font-bold text-gray-900 capitalize">
                        {material.type || "materi"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resources Section */}
                {material.resources && material.resources.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                      Materi Pendukung
                    </h3>
                    <div className="space-y-2">
                      {material.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileTextIcon className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-900 truncate">
                              {resource}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDownload(resource)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 ml-2"
                          >
                            <DownloadIcon className="w-3 h-3" />
                            <span className="hidden sm:inline">Unduh</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* YouTube Section - Mobile Optimized */}
                {material.youtubeUrl && (
                  <div className="mb-4">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                      Video Pembelajaran
                    </h3>
                    <div
                      className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black cursor-pointer group active:scale-[0.98] transition-transform duration-200"
                      onClick={handleWatchClick}
                    >
                      <div className="aspect-video flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <PlayCircleIcon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white font-medium text-sm md:text-base">
                            Tonton di YouTube
                          </p>
                          <p className="text-gray-300 text-xs mt-1">
                            Buka aplikasi YouTube
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Mobile Optimized */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex flex-col md:flex-row gap-3">
                {material.youtubeUrl && (
                  <button
                    onClick={handleWatchClick}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlayCircleIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Tonton di</span>
                    <span>YouTube</span>
                    <ExternalLinkIcon className="w-4 h-4" />
                  </button>
                )}
                <div
                  className={`flex gap-3 ${
                    material.youtubeUrl ? "md:w-2/3" : "w-full"
                  }`}
                >
                  <button
                    onClick={handleClose}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveProgress}
                    disabled={isSaving || !hasProgressChanged}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      !hasProgressChanged || isSaving
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 active:scale-95"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Menyimpan</span>
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
      </div>
    </>
  );
};

MaterialModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  material: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.oneOf(["video", "article"]),
    duration: PropTypes.string,
    progress: PropTypes.oneOf(["not_started", "in_progress", "completed"]),
    youtubeUrl: PropTypes.string,
    resources: PropTypes.arrayOf(PropTypes.string),
  }),
  onProgressUpdate: PropTypes.func.isRequired,
  onWatchYoutube: PropTypes.func.isRequired,
};

MaterialModal.defaultProps = {
  material: {
    id: "",
    title: "Materi",
    description: "Deskripsi materi",
    type: "video",
    duration: "0 menit",
    progress: "not_started",
    youtubeUrl: "",
    resources: [],
  },
};
