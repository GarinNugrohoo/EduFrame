import React from "react";
import { ClockIcon, CalendarIcon, UsersIcon } from "../icons/IkonWrapper";

const UserStats = ({ userStats, totalTimeSpent }) => {
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return "0";
    const mins = parseInt(minutes);
    return isNaN(mins) ? "0" : mins.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum pernah";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">
          Statistik Pembelajaran Anda
        </h3>
        <UsersIcon className="w-5 h-5 text-red-300" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Waktu */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-gray-700">
              Total Waktu Belajar
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {formatTime(totalTimeSpent)} menit
          </p>
          {totalTimeSpent >= 60 && (
            <p className="text-xs text-gray-500 mt-1">
              ({Math.floor(totalTimeSpent / 60)} jam {totalTimeSpent % 60}{" "}
              menit)
            </p>
          )}
        </div>

        {/* Terakhir Diakses */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-gray-700">
              Terakhir diakses
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {formatDate(userStats.last_accessed)}
          </p>
        </div>
      </div>

      {/* Statistik Tambahan jika ada */}
      {(userStats.completed_count || userStats.average_score) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            {userStats.completed_count !== undefined && (
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    Selesai
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {userStats.completed_count} materi
                </p>
              </div>
            )}

            {userStats.average_score !== undefined && (
              <div className="p-2 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    Nilai Rata-rata
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {userStats.average_score.toFixed(1)}/100
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;
