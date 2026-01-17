import PropTypes from "prop-types";

export const Header = ({ userName, motivationQuote }) => (
  <div className="relative mb-8 md:mb-12 p-5">
    <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-red-500 to-red-300 rounded-full"></div>

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 relative">
      Selamat datang, <span className="text-red-600 italic">{userName}</span>
      <span className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-red-500 to-red-300 rounded-full"></span>
    </h1>

    <div className="flex items-center mt-4">
      <svg
        className="w-5 h-5 text-red-400 mr-2"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
      <p className="text-gray-600 italic">{motivationQuote}</p>
    </div>
  </div>
);

Header.propTypes = {
  userName: PropTypes.string.isRequired,
  motivationQuote: PropTypes.string.isRequired,
};
