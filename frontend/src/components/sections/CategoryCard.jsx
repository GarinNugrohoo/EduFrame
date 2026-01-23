import PropTypes from "prop-types";
import { GraduationIcon } from "../icons/IkonWrapper";

export const CategoryCard = ({ category, index, onStartLearning }) => {
  const handleClick = () => {
    onStartLearning(category.id);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl md:rounded-2xl hover:border-red-300 transition-all duration-300 overflow-hidden hover:shadow-md md:hover:shadow-lg active:scale-[0.99]">
      <div className="flex items-start p-4 md:p-6">
        <div className="shrink-0 mr-3 md:mr-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-base md:text-lg group-active:scale-95 transition-transform duration-200 shadow-md shadow-red-200">
            {index + 1}
          </div>
        </div>

        <div className="grow min-w-0">
          <div className="mb-3 md:mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2 mb-1">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <div className="flex items-center text-gray-600 mt-1 md:mt-0">
                <GraduationIcon className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 flex-shrink-0" />
                <p className="text-xs md:text-sm truncate">
                  Kelas {category.subTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mb-4 md:mb-6 pl-4 md:pl-5">
            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 md:w-1.5 md:h-1.5 bg-red-400 rounded-full"></div>
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed italic line-clamp-3 md:line-clamp-none">
              {category.description}
            </p>
          </div>

          <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-300">
            <button
              onClick={handleClick}
              className="group/btn w-full md:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg md:rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-200 active:scale-95 active:shadow-md text-sm md:text-base"
              aria-label={`Mulai belajar ${category.name}`}
            >
              <span>Mulai Belajar</span>
              <svg
                className="ml-2 w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent rotate-45"></div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onStartLearning: PropTypes.func.isRequired,
};
