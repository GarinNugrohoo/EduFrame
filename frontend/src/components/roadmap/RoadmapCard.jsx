import PropTypes from "prop-types";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  VideoIcon,
  FileTextIcon,
} from "../icons/IkonWrapper";

export const RoadmapCard = ({ semester, semesterNumber, onMaterialClick }) => {
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
    <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden">
      {/* Semester Header */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 px-5 py-4 md:px-6 md:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">
                {semesterNumber}
              </span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                {semester.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {semester.materials.length} materi pembelajaran
              </p>
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Materials List */}
      <div className="p-4 md:p-6">
        <div className="space-y-3">
          {semester.materials.map((material, index) => (
            <button
              key={material.id}
              onClick={() => onMaterialClick(material)}
              className="w-full text-left group hover:bg-gray-50 p-3 md:p-4 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 active:scale-[0.98]"
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Number */}
                <div className="shrink-0">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="grow min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                    <h4 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1">
                      {material.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getProgressColor(
                          material.progress
                        )}`}
                      ></div>
                      <span className="text-xs text-gray-600">
                        {getProgressText(material.progress)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                    {material.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {material.type === "video" ? (
                          <VideoIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
                        ) : (
                          <FileTextIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                        )}
                        <span className="text-xs text-gray-600 capitalize">
                          {material.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {material.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">
                        Lihat detail
                      </span>
                      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

RoadmapCard.propTypes = {
  semester: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    materials: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["video", "article"]).isRequired,
        duration: PropTypes.string.isRequired,
        progress: PropTypes.oneOf(["completed", "in_progress", "not_started"])
          .isRequired,
        resources: PropTypes.arrayOf(PropTypes.string),
      })
    ).isRequired,
  }).isRequired,
  semesterNumber: PropTypes.number.isRequired,
  onMaterialClick: PropTypes.func.isRequired,
};
