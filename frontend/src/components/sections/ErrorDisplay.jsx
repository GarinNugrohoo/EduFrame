import PropTypes from "prop-types";

export const ErrorDisplay = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <div className="inline-block p-4 bg-red-50 rounded-2xl mb-4">
      <svg
        className="w-12 h-12 text-red-500 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="text-red-600 font-medium mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Coba Lagi
      </button>
    )}
  </div>
);

ErrorDisplay.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};
