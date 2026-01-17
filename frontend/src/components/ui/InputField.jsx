import PropTypes from "prop-types";

const InputField = ({
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  className = "",
  ...props
}) => {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          className={`w-full ${
            Icon ? "pl-12" : "pl-4"
          } pr-4 py-3.5 border-2 rounded-xl outline-none transition-all text-base ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          } ${className}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.elementType,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default InputField;
