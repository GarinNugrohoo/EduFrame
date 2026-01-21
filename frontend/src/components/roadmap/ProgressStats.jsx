import { TrophyIcon } from "../icons/IkonWrapper";

const ProgressStats = ({ progress, color }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">Progress Belajar</h3>
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
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${progress.percentage * 1.76} 176`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {progress.percentage}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">Materi selesai</span>
              <span className="text-sm font-bold text-gray-900">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress.percentage}%`,
                  backgroundColor: color,
                }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">
                  {progress.completed}
                </span>
              </div>
              <p className="text-xs text-gray-600">Selesai</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs font-medium">
                  {progress.in_progress || 0}
                </span>
              </div>
              <p className="text-xs text-gray-600">Sedang</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs font-medium">
                  {progress.not_started || 0}
                </span>
              </div>
              <p className="text-xs text-gray-600">Belum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
