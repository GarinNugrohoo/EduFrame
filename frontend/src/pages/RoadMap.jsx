import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  HomeIcon,
  TrophyIcon,
  VideoIcon,
  FileTextIcon,
  ChevronRightIcon,
  XIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../components/icons/IkonWrapper";

// DUMMY ROADMAP DATA dengan 2 semester (bisa dibuka/tutup)
const ROADMAP_DATA = {
  // ID 1: Matematika Wajib - 2 Semester
  1: {
    id: "1",
    name: "Matematika Wajib",
    code: "MAT",
    description:
      "Materi matematika wajib untuk kelas 11 semester ganjil dan genap",
    grade_level: "11",
    semester: "ganjil & genap",
    color: "#4CAF50",
    semesters: [
      {
        id: "semester-ganjil",
        title: "Semester Ganjil",
        isOpen: true,
        materials: [
          {
            id: "m1-1",
            title: "Persamaan Kuadrat",
            description:
              "Mempelajari konsep dasar persamaan kuadrat dan pemfaktoran",
            type: "video",
            duration: "25 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            progress: "not_started",
            resources: ["PDF Materi", "Latihan Soal"],
          },
          {
            id: "m1-2",
            title: "Fungsi Linier",
            description: "Memahami fungsi linier dan aplikasinya",
            type: "article",
            duration: "30 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
            progress: "not_started",
            resources: ["Video Penjelasan", "Kuis"],
          },
          {
            id: "m1-3",
            title: "Trigonometri Dasar",
            description: "Pengenalan sinus, cosinus, dan tangen",
            type: "video",
            duration: "35 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
            progress: "not_started",
            resources: ["Worksheet", "Simulasi"],
          },
        ],
      },
      {
        id: "semester-genap",
        title: "Semester Genap",
        isOpen: false,
        materials: [
          {
            id: "m1-4",
            title: "Statistika Dasar",
            description: "Mean, median, modus, dan penyajian data",
            type: "article",
            duration: "20 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=kffacxfA7G4",
            progress: "not_started",
            resources: ["PDF Materi", "Dataset Latihan"],
          },
          {
            id: "m1-5",
            title: "Peluang",
            description: "Konsep dasar peluang dan probabilitas",
            type: "video",
            duration: "28 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=example1",
            progress: "not_started",
            resources: ["Simulasi", "Contoh Kasus"],
          },
          {
            id: "m1-6",
            title: "Logika Matematika",
            description: "Pengenalan logika matematika dasar",
            type: "article",
            duration: "22 menit",
            youtubeUrl: "https://www.youtube.com/watch?v=example2",
            progress: "not_started",
            resources: ["Diagram Logika", "Latihan"],
          },
        ],
      },
    ],
    progress: {
      completed: 0,
      total: 6,
      percentage: 0,
    },
  },
};

// RoadmapCard Component
const RoadmapCard = ({
  semester,
  semesterNumber,
  onMaterialClick,
  isOpen,
  onToggle,
}) => {
  const getProgressColor = (progress) => {
    switch (progress) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const getProgressText = (progress) => {
    switch (progress) {
      case "completed":
        return "Selesai";
      case "in_progress":
        return "Sedang dipelajari";
      default:
        return "Belum mulai";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-3">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-rose-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {semesterNumber}
              </span>
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-gray-900">
                {semester.title}
              </h3>
              <p className="text-xs text-gray-600">
                {semester.materials.length} materi •{" "}
                {isOpen ? "Terbuka" : "Tertutup"}
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3">
          <div className="space-y-2">
            {semester.materials.map((material, index) => (
              <button
                key={material.id}
                onClick={() => onMaterialClick(material)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${getProgressColor(
                        material.progress
                      )}`}
                    ></div>
                  </div>
                  <div className="grow min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {index + 1}. {material.title}
                      </h4>
                      <span className="text-xs text-gray-500 shrink-0">
                        {getProgressText(material.progress)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {material.type === "video" ? (
                            <VideoIcon className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <FileTextIcon className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span className="text-xs text-gray-600 capitalize">
                            {material.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {material.duration}
                          </span>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// MaterialModal Component - FIXED dengan null safety
const MaterialModal = ({
  isOpen,
  onClose,
  material,
  onProgressUpdate,
  onWatchYoutube,
}) => {
  // Default material untuk menghindari null
  const safeMaterial = useMemo(() => {
    return (
      material || {
        id: "",
        title: "Materi",
        description: "Deskripsi materi",
        type: "video",
        duration: "0 menit",
        progress: "not_started",
        youtubeUrl: "",
        resources: [],
      }
    );
  }, [material]);

  const [selectedProgress, setSelectedProgress] = useState(
    safeMaterial.progress || "not_started"
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && safeMaterial.progress) {
      setSelectedProgress(safeMaterial.progress);
    }
  }, [isOpen, safeMaterial]);

  const handleProgressChange = (progress) => {
    setSelectedProgress(progress);
  };

  const handleSave = async () => {
    if (!safeMaterial.id || selectedProgress === safeMaterial.progress) {
      onClose();
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onProgressUpdate(safeMaterial.id, selectedProgress);
      setIsSaving(false);
      onClose();
    }, 300);
  };

  const handleWatchClick = () => {
    if (safeMaterial.youtubeUrl) {
      onWatchYoutube(safeMaterial.youtubeUrl);
    }
  };

  // Early return jika modal tidak open
  if (!isOpen) return null;

  const progressOptions = [
    {
      value: "not_started",
      label: "Belum Mulai",
      icon: BookOpenIcon,
      color: "gray",
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

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleProgressChange(option.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative ${
                        isSelected
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : "border-gray-200 hover:border-gray-300"
                      } ${
                        isCurrent ? "ring-2 ring-offset-1 ring-blue-400" : ""
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          isSelected
                            ? `bg-${option.color}-500 text-white`
                            : "bg-gray-100 text-gray-400"
                        }`}
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
                      Durasi
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

            {safeMaterial.resources && safeMaterial.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Materi Pendukung
                </h3>
                <div className="space-y-2">
                  {safeMaterial.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <FileTextIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-900">
                          {resource}
                        </span>
                      </div>
                      <button className="text-xs text-red-600 font-medium px-3 py-1 hover:bg-red-50 rounded-lg">
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

const RoadMap = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSemesters, setOpenSemesters] = useState({});

  useEffect(() => {
    const fetchRoadmapData = () => {
      try {
        setTimeout(() => {
          const data = ROADMAP_DATA[subjectId];

          if (data) {
            const initialOpenState = {};
            data.semesters.forEach((semester, index) => {
              initialOpenState[semester.id] = index === 0;
            });

            setOpenSemesters(initialOpenState);
            setRoadmapData(data);
          } else {
            setRoadmapData(null);
          }

          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading roadmap:", error);
        setRoadmapData(null);
        setLoading(false);
      }
    };

    fetchRoadmapData();
    localStorage.setItem("lastSubjectId", subjectId);
  }, [subjectId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastSubjectId", subjectId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [subjectId]);

  const handleMaterialClick = useCallback((material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  }, []);

  const handleProgressUpdate = useCallback((materialId, newProgress) => {
    setRoadmapData((prev) => {
      if (!prev) return prev;

      const updatedSemesters = prev.semesters.map((semester) => ({
        ...semester,
        materials: semester.materials.map((material) =>
          material.id === materialId
            ? { ...material, progress: newProgress }
            : material
        ),
      }));

      const totalMaterials = updatedSemesters.reduce(
        (total, semester) => total + semester.materials.length,
        0
      );
      const completedMaterials = updatedSemesters.reduce(
        (total, semester) =>
          total +
          semester.materials.filter((m) => m.progress === "completed").length,
        0
      );

      return {
        ...prev,
        semesters: updatedSemesters,
        progress: {
          total: totalMaterials,
          completed: completedMaterials,
          percentage: Math.round((completedMaterials / totalMaterials) * 100),
        },
      };
    });
  }, []);

  const handleToggleSemester = useCallback((semesterId) => {
    setOpenSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }));
  }, []);

  const handleWatchYoutube = useCallback((url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleBackToHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Roadmap tidak ditemukan</p>
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const progressColor = roadmapData.color || "#EF4444";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToHome}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: roadmapData.color }}
                ></div>
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {roadmapData.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                  {roadmapData.code}
                </span>
                <span>•</span>
                <span>Kelas {roadmapData.grade_level}</span>
                <span>•</span>
                <span>{roadmapData.semester}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <p className="text-sm text-gray-700">{roadmapData.description}</p>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">
              Progress Belajar
            </h3>
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={progressColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      roadmapData.progress.percentage * 1.76
                    } 176`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {roadmapData.progress.percentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Materi selesai</span>
                  <span className="text-sm font-bold text-gray-900">
                    {roadmapData.progress.completed}/
                    {roadmapData.progress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${roadmapData.progress.percentage}%`,
                      backgroundColor: progressColor,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {roadmapData.semesters.reduce(
                        (acc, semester) =>
                          acc +
                          semester.materials.filter(
                            (m) => m.progress === "completed"
                          ).length,
                        0
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Selesai</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {roadmapData.semesters.reduce(
                        (acc, semester) =>
                          acc +
                          semester.materials.filter(
                            (m) => m.progress === "in_progress"
                          ).length,
                        0
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Sedang</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {roadmapData.semesters.reduce(
                        (acc, semester) =>
                          acc +
                          semester.materials.filter(
                            (m) => m.progress === "not_started"
                          ).length,
                        0
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Belum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Struktur Pembelajaran ({roadmapData.semesters.length} Semester)
            </h2>
            <button
              onClick={() => {
                const newOpenState = {};
                const allOpen = Object.values(openSemesters).every((v) => v);
                roadmapData.semesters.forEach((semester) => {
                  newOpenState[semester.id] = !allOpen;
                });
                setOpenSemesters(newOpenState);
              }}
              className="text-xs text-red-600 font-medium px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              {Object.values(openSemesters).every((v) => v)
                ? "Tutup Semua"
                : "Buka Semua"}
            </button>
          </div>

          <div className="space-y-3">
            {roadmapData.semesters.map((semester, index) => (
              <RoadmapCard
                key={semester.id}
                semester={semester}
                semesterNumber={index + 1}
                onMaterialClick={handleMaterialClick}
                isOpen={openSemesters[semester.id] || false}
                onToggle={() => handleToggleSemester(semester.id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Tips Belajar Efektif
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Belajar bertahap
                </h4>
                <p className="text-xs text-gray-600">
                  Selesaikan satu materi sebelum lanjut ke materi berikutnya
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PlayCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Tonton dengan fokus
                </h4>
                <p className="text-xs text-gray-600">
                  Matikan notifikasi saat menonton video pembelajaran
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        material={selectedMaterial}
        onProgressUpdate={handleProgressUpdate}
        onWatchYoutube={handleWatchYoutube}
      />
    </div>
  );
};

export default RoadMap;
