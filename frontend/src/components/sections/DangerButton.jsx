import PropTypes from "prop-types";

export const DangerButton = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
  variant = "danger",
}) => {
  const isDanger = variant === "danger";

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-4 border ${
        isDanger
          ? "border-red-200 hover:border-red-300 hover:bg-red-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      } transition-colors text-left`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDanger ? "bg-red-50" : "bg-gray-100"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                isDanger ? "text-red-600" : "text-gray-700"
              }`}
            />
          </div>
          <div>
            <h4
              className={`font-semibold ${
                isDanger ? "text-red-700" : "text-gray-900"
              }`}
            >
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDanger ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          }`}
        >
          →
        </div>
      </div>
    </button>
  );
};

DangerButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["danger", "neutral"]),
};
