import PropTypes from "prop-types";
import { GraduationIcon } from "../icons/IkonWrapper";

export const CategoryCard = ({ category, index, onStartLearning }) => {
  const handleClick = () => {
    onStartLearning(category.id);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl hover:border-red-300 transition-all duration-300 overflow-hidden hover:shadow-lg">
      <div className="flex items-start p-6">
        <div className="shrink-0 mr-4 relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-200">
            {index + 1}
          </div>
        </div>

        <div className="grow">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                {category.name}
              </h3>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <GraduationIcon className="mr-2" />
              <p className="text-sm">Kelas {category.subTitle}</p>
            </div>
          </div>

          <div className="relative mb-6 pl-5">
            <div className="absolute left-0 top-1.5 w-3 h-3 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            </div>
            <p className="text-gray-700 leading-relaxed italic">
              {category.description}
            </p>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-300">
            <button
              onClick={handleClick}
              className="group/btn inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-200 relative"
              aria-label={`Mulai belajar ${category.name}`}
            >
              <span>Mulai Belajar</span>
              <svg
                className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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

      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent rotate-45"></div>
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
