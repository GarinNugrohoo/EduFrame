import React from "react";
import MaterialItem from "./MaterialItem";
import { ChevronDownIcon, ChevronUpIcon } from "../icons/IkonWrapper";

const SemesterCard = ({
  semester,
  semesterNumber,
  isOpen,
  onToggle,
  onMaterialClick,
}) => {
  const completedMaterials = semester.materials.filter(
    (m) => m.progress === "completed",
  ).length;
  const totalMaterials = semester.materials.length;
  const completionPercentage =
    totalMaterials > 0
      ? Math.round((completedMaterials / totalMaterials) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-3 transition-all duration-200">
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
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{semester.materials.length} materi</span>
                <span>•</span>
                <span
                  className={
                    isOpen ? "text-red-600 font-medium" : "text-gray-500"
                  }
                >
                  {isOpen ? "Terbuka" : "Tertutup"}
                </span>
                {completedMaterials > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">
                      {completedMaterials}/{totalMaterials} selesai
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {completionPercentage > 0 && (
              <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            )}
            {isOpen ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-3 animate-fadeIn">
          <div className="space-y-2">
            {semester.materials.map((material, index) => (
              <MaterialItem
                key={material.id}
                material={material}
                index={index}
                onClick={() => onMaterialClick(material)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterCard;
