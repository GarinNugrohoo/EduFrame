import {
  VideoIcon,
  FileTextIcon,
  ClockIcon,
  ChevronRightIcon,
} from "../icons/IkonWrapper";

const MaterialItem = ({ material, index, onClick }) => {
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
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <div
            className={`w-2 h-2 rounded-full mt-2 ${getProgressColor(material.progress)}`}
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
                  {material.timeSpentMinutes > 0 && (
                    <span className="text-green-600 ml-1">
                      ({material.timeSpentMinutes}m)
                    </span>
                  )}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </button>
  );
};

export default MaterialItem;
