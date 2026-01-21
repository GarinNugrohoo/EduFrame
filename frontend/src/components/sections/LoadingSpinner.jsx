import PropTypes from "prop-types";
import logo from "../../assets/EduFrameLoading.png";

export const LoadingSpinner = ({ message = "Memuat kategori..." }) => (
  <div className="text-center py-12" role="status" aria-live="polite">
    <div className="inline-block from-red-50 to-white rounded-2xl mb-2">
      <div className="relative">
        <img
          src={logo}
          alt="EduFrame Loading"
          className="w-20 h-22 text-red-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
    <p className="text-red-500 font-medium italic flex-row">{message}</p>
    <div className="mt-4 flex justify-center space-x-2">
      {[0, 100, 300].map((delay) => (
        <div
          key={delay}
          className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        ></div>
      ))}
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};
