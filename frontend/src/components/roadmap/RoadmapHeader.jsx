import React from "react";
import { ArrowLeftIcon, ClockIcon } from "../icons/IkonWrapper";

const RoadmapHeader = ({ roadmapData, onBack, onRefresh }) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
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
              <button
                onClick={onRefresh}
                className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh data"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
              <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                {roadmapData.code}
              </span>
              <span>•</span>
              <span>Kelas {roadmapData.grade_level}</span>
              <span>•</span>
              <span>{roadmapData.semester}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {roadmapData.total_hours} jam
              </span>
              <span
                className={`px-1.5 py-0.5 rounded ${roadmapData.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
              >
                {roadmapData.is_active ? "Aktif" : "Non-Aktif"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapHeader;
