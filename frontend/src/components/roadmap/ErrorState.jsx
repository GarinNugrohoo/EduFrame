import { XIcon } from "../icons/IkonWrapper";

const ErrorState = ({ message, onBack, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XIcon className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Roadmap Tidak Ditemukan
      </h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Kembali ke Beranda
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </div>
);

export default ErrorState;
