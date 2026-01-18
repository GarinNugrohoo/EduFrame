import React from "react";

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Memuat roadmap...</p>
    </div>
  </div>
);

export default LoadingState;
